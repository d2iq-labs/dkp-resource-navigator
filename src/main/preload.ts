import { KubernetesObject } from '@kubernetes/client-node';
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { Deployment } from 'models/deployments';
import { Resource } from 'models/resources';

export type Channels = 'ipc-example';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    requestResources() {
      ipcRenderer.send('requestResources');
    },
    receiveResources(func: (data: Resource[]) => void) {
      const subscription = (_event: IpcRendererEvent, data: Resource[]) =>
        func(data);
      ipcRenderer.on('receiveResources', subscription);
    },
    requestSpecificResources(apiVersion: string, resourceName: string) {
      ipcRenderer.send('requestSpecificResources', apiVersion, resourceName);
    },
    receiveSpecificResources(func: (data: KubernetesObject[]) => void) {
      const subscription = (
        _event: IpcRendererEvent,
        data: KubernetesObject[]
      ) => func(data);
      ipcRenderer.on('receiveSpecificResources', subscription);
    },

    requestEditSpecificResources(
      namespace: string,
      apiVersion: string,
      resourceName: string,
      specificName: string,
      updatedObject: string
    ) {
      ipcRenderer.send(
        'requestEditSpecificResources',
        namespace,
        apiVersion,
        resourceName,
        specificName,
        updatedObject
      );
    },
    receiveEditSpecificResources(func: (data: string) => void) {
      const subscription = (_event: IpcRendererEvent, data: string) =>
        func(data);
      ipcRenderer.on('receiveEditSpecificResources', subscription);
    },

    requestDeployments() {
      ipcRenderer.send('requestDeployments');
    },
    receiveDeployments(func: (data: Deployment[]) => void) {
      const subscription = (_event: IpcRendererEvent, data: Deployment[]) =>
        func(data);
      ipcRenderer.on('receiveDeployments', subscription);
    },
    createDeployment(imageName: string, deploymentName: string) {
      ipcRenderer.send('createDeployment', imageName, deploymentName);
    },
    portForward(deploymentName: string) {
      ipcRenderer.send('portForward', deploymentName);
    },
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: string, func: (...args: unknown[]) => void) {
      const validChannels = ['receiveDeployments'];
      if (validChannels.includes(channel)) {
        const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
          func(...args);
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, subscription);

        return () => ipcRenderer.removeListener(channel, subscription);
      }

      return undefined;
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
});
