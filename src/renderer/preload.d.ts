import { KubernetesObject } from '@kubernetes/client-node';
import { Deployment } from 'models/deployments';
import { Resource } from 'models/resources';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        requestResources(): void;
        receiveResources(
          func: (resources: Resource[]) => void
        ): (() => void) | undefined;
        requestSpecificResources(apiVersion: string, resourceName: string): void;
        receiveSpecificResources(
          func: (kubernetesObjects: KubernetesObject[]) => void
        ): (() => void) | undefined;
        requestDeployments(): void;
        receiveDeployments(
          func: (deployments: Deployment[]) => void
        ): (() => void) | undefined;
        createDeployment(imageName: string, deploymentName: string): void;
        portForward(deploymentName: string): void;
        sendMessage(channel: string, args: unknown[]): void;
        on(
          channel: string,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
      };
    };
  }
}

export {};
