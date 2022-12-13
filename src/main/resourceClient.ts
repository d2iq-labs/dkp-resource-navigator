import * as yaml from 'js-yaml';
import * as fs from 'fs';
import axios, { AxiosInstance } from 'axios';
import { Agent } from 'https';
import { ipcMain } from 'electron';
// @ts-ignore-next-line-no-types
import * as base64 from 'base-64';

function getClient(KUBECONFIG = process.env.KUBECONFIG): AxiosInstance {
  if (!KUBECONFIG) {
    throw Error('please give me a KUBECONFIG path to work with.');
  }

  try {
    const kubeconfig = yaml.load(fs.readFileSync(KUBECONFIG, 'utf-8'));

    // @ts-ignore
    const { cluster } = kubeconfig.clusters[0];
    // @ts-ignore
    const { user } = kubeconfig.users[0];

    return axios.create({
      baseURL: cluster.server,
      headers: {
        Accept: 'application/json',
        // we only patch in here for now. you'll need to refactor this in case we ever do something else!
        'Content-Type': 'application/merge-patch+json',
      },
      httpsAgent: new Agent({
        ca: base64.decode(cluster['certificate-authority-data']),
        cert: base64.decode(user['client-certificate-data']),
        keepAlive: true,
        key: base64.decode(user['client-key-data']),
      }),
    });
  } catch (e) {
    throw Error(`KUBECONFIG seems to be malformed: ${e}`);
  }
}
export const client = getClient();

const getSpecificResources = async (
  namespace: string,
  apiVersion: string,
  resourceName: string
) => {
  try {
    const url = `/apis/${apiVersion}/namespaces/${namespace}/${resourceName}/`;
    const items = (await client.get(url)).data?.items;

    // @ts-ignore
    items.forEach((item) => {
      item.apiVersion = apiVersion;
      item.kind = resourceName;
    });
    return items;
  } catch (e) {
    console.log(`Unable to get ${resourceName}. ${e.message}`);
  }
};

const editSpecificResource = async (
  namespace: string,
  apiVersion: string,
  resourceName: string,
  specificName: string,
  updatedObject: string
) => {
  try {
    const url = `/apis/${apiVersion}/namespaces/${namespace}/${resourceName}/${specificName}`;
    const objYaml = yaml.load(updatedObject) as any;
    console.log('objYaml', objYaml);
    client.patch(url, { spec: objYaml.spec, metadata: objYaml.metadata });
    return 'Success';
  } catch (e) {
    console.log(`Unable to patch ${specificName}. ${e.message}`);
    console.log(e);
  }
};

ipcMain.on(
  'requestSpecificResources',
  async (event, apiVersion: string, resourceName: string) => {
    const resources = await getSpecificResources(
      'default',
      apiVersion,
      resourceName
    );
    event.sender.send('receiveSpecificResources', resources);
  }
);

ipcMain.on(
  'requestEditSpecificResources',
  async (
    event,
    namespace: string,
    apiVersion: string,
    resourceName: string,
    specificName: string,
    updatedObject: string
  ) => {
    const patchRequest = await editSpecificResource(
      namespace,
      apiVersion,
      resourceName,
      specificName,
      updatedObject
    );
    event.sender.send('receiveEditSpecificResources', patchRequest);

    const resources = await getSpecificResources(
      'default',
      apiVersion,
      resourceName
    );
    event.sender.send('receiveSpecificResources', resources);
  }
);
