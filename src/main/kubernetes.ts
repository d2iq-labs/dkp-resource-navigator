import { ipcMain } from 'electron';
import * as net from 'net';
import {
  KubeConfig,
  V1Deployment,
  AppsV1Api,
  PortForward,
  CoreV1Api,
  V1APIResource,
} from '@kubernetes/client-node';
import { Deployment, Status } from '../models/deployments';

const kc = new KubeConfig();
kc.loadFromDefault();

const appsV1Client = kc.makeApiClient(AppsV1Api);
const coreV1Client = kc.makeApiClient(CoreV1Api);

const getDeploymentStatus = (deployment: V1Deployment): Status => {
  const { status } = deployment;
  if (!status || status.availableReplicas === undefined) {
    return Status.Unknown;
  }
  if (status.unavailableReplicas) {
    return Status.Unavailable;
  }
  if (status.availableReplicas === status.replicas) {
    return Status.Available;
  }

  return Status.Unknown;
};

const getDeployments = async () => {
  const response = await appsV1Client.listNamespacedDeployment('default');
  const deployments: Deployment[] = response.body.items.map(
    (x: V1Deployment) => {
      return {
        name: x.metadata?.name,
        image: x.spec?.template?.spec?.containers[0].image,
        replicas: x.status?.replicas ?? 0,
        status: getDeploymentStatus(x),
      };
    }
  );
  return deployments;
};

const getResources = async () => {
  const response = await appsV1Client.getAPIResources();
  const resources: V1APIResource[] = response.body.resources.filter(
      (x: V1APIResource) => {
        return x.name.indexOf("/") == -1;
      }
    )
    .map(
    (x: V1APIResource) => {
      return {
        name: x.name,
        kind: x.kind,
        apiVersion: response.body.groupVersion,
        namespaced: x.namespaced,
        singularName: x.singularName,
        verbs: x.verbs,
      };
    }
  );
  return resources;
};



ipcMain.on('requestResources', async (event) => {
  const resources = await getResources();
  event.sender.send('receiveResources', resources);
});

ipcMain.on('requestDeployments', async (event) => {
  const deployments = await getDeployments();
  event.sender.send('receiveDeployments', deployments);
});

ipcMain.on(
  'createDeployment',
  async (event, imageName: string, deploymentName: string) => {
    const newDeployment = {
      metadata: {
        name: deploymentName,
      },
      spec: {
        selector: {
          matchLabels: {
            app: deploymentName,
            env: 'dev',
          },
        },
        replicas: 1,
        template: {
          metadata: {
            labels: {
              app: deploymentName,
              env: 'dev',
            },
          },
          spec: {
            containers: [
              {
                name: deploymentName,
                image: imageName,
              },
            ],
          },
        },
      },
    };
    try {
      await appsV1Client.createNamespacedDeployment('default', newDeployment);
      const deployments = await getDeployments();
      event.sender.send('receiveDeployments', deployments);
    } catch (error) {
      console.error(error);
    }
  }
);

ipcMain.on('portForward', async (_, deploymentName: string) => {
  try {
    await coreV1Client.createNamespacedService('default', {
      metadata: {
        name: `${deploymentName}-service`,
      },
      spec: {
        type: 'LoadBalancer',
        selector: {
          app: deploymentName,
        },
        ports: [
          {
            targetPort: 3000,
            port: 3000,
            nodePort: 30008,
          },
        ],
      },
    });

    const forward = new PortForward(kc);

    // This simple server just forwards traffic from itself to a service running in kubernetes
    // -> localhost:8080 -> port-forward-tunnel -> kubernetes-pod
    // This is basically equivalent to 'kubectl port-forward ...' but in TypeScript.
    const server = net.createServer((socket) => {
      forward.portForward(
        'default',
        `${deploymentName}-service`,
        [3003],
        socket,
        null,
        socket
      );
    });

    server.listen(3003, '127.0.0.1');
  } catch (error) {
    console.error(error);
  }
});
