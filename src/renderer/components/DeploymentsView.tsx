import {
  SpacingBox,
  PrimaryButton,
  PageHeader,
  FlexItem,
  Flex,
} from '@d2iq/ui-kit';
import { customAlphabet } from 'nanoid';

import { Deployment } from 'models/deployments';
import { useEffect, useState } from 'react';
import { DeploymentsTable } from './DeploymentsTable';

const nanoid = customAlphabet('1234567890abcdefgh', 10);

export const DeploymentsView = () => {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const getDeployments = () => {
    window.electron.ipcRenderer.requestDeployments();
  };

  useEffect(() => {
    const fetchDeployments = async () => {
      window.electron.ipcRenderer.receiveDeployments((data: Deployment[]) => {
        setDeployments(data ?? []);
      });
    };
    fetchDeployments();
  }, []);

  return (
    <>
      <PageHeader
        breadcrumbElements={['Deployments']}
        actions={[
          <PrimaryButton type="button" onClick={getDeployments}>
            Get Deployments
          </PrimaryButton>,
        ]}
      />
      <div>
        <SpacingBox>
          <DeploymentsTable deployments={deployments} />
        </SpacingBox>
      </div>
      <Flex align="flex-start" gutterSize="m">
        <FlexItem flex="shrink">
          <PrimaryButton
            onClick={() =>
              window.electron.ipcRenderer.createDeployment(
                'nginx',
                `nginx-${nanoid(6)}`
              )
            }
          >
            Create NGINX Deployment
          </PrimaryButton>
        </FlexItem>
        <FlexItem flex="shrink">
          <PrimaryButton
            onClick={() =>
              window.electron.ipcRenderer.createDeployment(
                'busybox',
                `busybox-${nanoid(6)}`
              )
            }
          >
            Create BusyBox Deployment
          </PrimaryButton>
        </FlexItem>
        <FlexItem flex="shrink">
          <PrimaryButton
            onClick={() =>
              window.electron.ipcRenderer.createDeployment(
                'clintomed/hello-kubernetes:0.1.0',
                `hello-kubernetes-${nanoid(6)}`
              )
            }
          >
            Create hello world Deployment
          </PrimaryButton>
        </FlexItem>
      </Flex>
    </>
  );
};
