import { ipcMain } from 'electron';
import { KubeConfig, V1Deployment, AppsV1Api } from '@kubernetes/client-node';
import { Deployment, Status } from '../models/deployments';

const kc = new KubeConfig();
kc.loadFromDefault();

const k8sAppsClient = kc.makeApiClient(AppsV1Api);

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

ipcMain.on('requestDeployments', async (event) => {
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

  event.sender.send('receiveDeployments', deployments);
});
