import * as yaml from 'js-yaml';
import { SpacingBox, PrimaryButton, PageHeader } from '@d2iq/ui-kit';
import { customAlphabet } from 'nanoid';
import { KubernetesObject } from '@kubernetes/client-node';

import { Resource } from 'models/resources';
import { useEffect, useState } from 'react';
import { ResourcesTable } from './ResourcesTable';
import { K8sObjectsTable } from './K8sObjectsTable';
import CodeEditorInput from './CodeEditorInput';

const nanoid = customAlphabet('1234567890abcdefgh', 10);

export const ResourcesView = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [k8sObjects, setK8sObjects] = useState<KubernetesObject[] | null>();
  const [editK8sObject, setEditK8sObject] = useState<KubernetesObject | null>();
  const getResources = () => {
    window.electron.ipcRenderer.requestResources();
  };

  useEffect(() => {
    const fetchResources = async () => {
      window.electron.ipcRenderer.receiveResources((data: Resource[]) => {
        setResources(data ?? []);
      });
    };
    fetchResources();
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.receiveSpecificResources(
      (data: KubernetesObject[]) => {
        console.log('resource view');
        console.log(data);
        setK8sObjects(data ?? []);
      }
    );
  }, []);

  const onEditObject = (object: KubernetesObject) => {
    console.log("onEditObject");
    setK8sObjects(null);
    setEditK8sObject(object);
  };

  const viewHandler = () => {
    if (k8sObjects) {
      return (
        <K8sObjectsTable k8sObjects={k8sObjects} onEditObject={onEditObject} />
      );
    }
    if (editK8sObject) {
      console.log("editK8sObject")
      // editK8sObject
      editK8sObject.apiVersion
      let k8sObjectYaml: string = yaml.dump(editK8sObject, {}
      );
      return <CodeEditorInput
                value={k8sObjectYaml}
            />;
    } else return <ResourcesTable resources={resources} />;
  };

  const buttonHandler = () => {
    if (k8sObjects) {
      return [
        <PrimaryButton type="button" onClick={() => setK8sObjects(null)}>
          Go Back
        </PrimaryButton>,
      ];
    }
    if (editK8sObject) {
      return [
        <PrimaryButton type="button" onClick={() => setEditK8sObject(null)}>
          Go Back
        </PrimaryButton>,
      ];
    } else
      return [
        <PrimaryButton type="button" onClick={getResources}>
          Get Resources
        </PrimaryButton>,
      ];
  };

  return (
    <>
      <PageHeader breadcrumbElements={['Resources']} actions={buttonHandler()} />
      <div>
        <SpacingBox>{viewHandler()}</SpacingBox>
      </div>
    </>
  );
};
