import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { ApiResource } from 'models/apiResource';
import { Deployment } from 'models/deployments';

export type Channels = 'ipc-example';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    requestDeployments() {
      ipcRenderer.send('requestDeployments');
    },
    receiveDeployments(func: (data: Deployment[]) => void) {
      const subscription = (_event: IpcRendererEvent, data: Deployment[]) =>
        func(data);
      ipcRenderer.on('receiveDeployments', subscription);
    },
    createDeployment(imageName: string) {
      ipcRenderer.send('createDeployment', imageName);
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
