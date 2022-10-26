import {
  SpacingBox,
  PrimaryButton,
  PageHeader,
  FlexItem,
  Flex,
} from '@dcos/ui-kit';
import { Deployment } from 'models/deployments';
import { useEffect, useState } from 'react';
import { DeploymentsTable } from './DeploymentTable';

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
              window.electron.ipcRenderer.createDeployment('nginx')
            }
          >
            Create NGINX Deployment
          </PrimaryButton>
        </FlexItem>
        <FlexItem>
          <PrimaryButton
            onClick={() =>
              window.electron.ipcRenderer.createDeployment('busybox')
            }
          >
            Create BusyBox Deployment
          </PrimaryButton>
        </FlexItem>
      </Flex>
    </>
  );
};
