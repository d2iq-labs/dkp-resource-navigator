import { ipcMain } from 'electron';
import { KubeConfig, V1Deployment, AppsV1Api } from '@kubernetes/client-node';
import { customAlphabet } from 'nanoid'
import { Deployment, Status } from '../models/deployments';

const kc = new KubeConfig();
kc.loadFromDefault();

const k8sAppsClient = kc.makeApiClient(AppsV1Api);
const nanoid = customAlphabet('1234567890abcdefgh', 10);
const getDeploymentStatus = (deployment: V1Deployment): Status => {
  const { status } = deployment;
  if (!status) {
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
  const response = await k8sAppsClient.listNamespacedDeployment('default');
  const deployments: Deployment[] = response.body.items.map(
    (x: V1Deployment) => {
      return {
        name: x.metadata?.name,
        image: x.spec?.template?.spec?.containers[0].image,
        replicas: x.status?.replicas ?? 0,
        status: getDeploymentStatus(x),
      };
    },
  );
  return deployments;
};

ipcMain.on('requestDeployments', async (event) => {
  const deployments = await getDeployments();
  event.sender.send('receiveDeployments', deployments);
});

ipcMain.on('createDeployment', async (event, imageName: string) => {
  const name = `${imageName}-${nanoid(6)}`;
  const newDeployment = {
    metadata: {
      name,
    },
    spec: {
      selector: {
        matchLabels: {
          app: imageName,
        },
      },
      replicas: 3,
      template: {
        metadata: {
          labels: {
            app: imageName,
          },
        },
        spec: {
          containers: [
            {
              name,
              image: imageName,
            },
          ],
        },
      },
    },
  };
  try {
    await k8sAppsClient.createNamespacedDeployment('default', newDeployment);
    const deployments = await getDeployments();
    event.sender.send('receiveDeployments', deployments);
  } catch (error) {
    console.error(error);
  }
});
