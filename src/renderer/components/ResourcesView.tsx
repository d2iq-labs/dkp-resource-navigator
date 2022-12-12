import {
  SpacingBox,
  PrimaryButton,
  PageHeader,
  FlexItem,
  Flex,
} from '@d2iq/ui-kit';
import { customAlphabet } from 'nanoid';

import { Resource } from 'models/resources';
import { useEffect, useState } from 'react';
import { ResourcesTable } from './ResourcesTable';
import { KubernetesObject } from '@kubernetes/client-node';
import { K8sObjectsTable } from './K8sObjectsTable';

const nanoid = customAlphabet('1234567890abcdefgh', 10);

export const ResourcesView = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [k8sObjects, setK8sObjects] = useState<KubernetesObject[] | null>();
  const getResources = () => {
    window.electron.ipcRenderer.requestResources();
  };

  useEffect(() => {
    const fetchResources = async () => {
      window.electron.ipcRenderer.receiveResources((data: Resource[]) => {
        setResources(data ?? []);
      });
      window.electron.ipcRenderer.receiveSpecificResources((data: KubernetesObject[]) => {
        console.log('resource view')
        console.log(data)
        setK8sObjects(data ?? []);
      });
    };
    fetchResources();
  }, []);
  const actionButtons = k8sObjects ? [
    <PrimaryButton type="button" onClick={() => setK8sObjects(null)}>
      Go back
    </PrimaryButton>,
    
  ]: [<PrimaryButton type="button" onClick={getResources}>
    Get Resources
  </PrimaryButton>,
  ]
  
  return (
    <>
      <PageHeader
        breadcrumbElements={['Resources']}
        actions={actionButtons}
      />
      <div>
        <SpacingBox>
          { k8sObjects ?   <K8sObjectsTable k8sObjects={k8sObjects} /> : <ResourcesTable resources={resources} /> }
        </SpacingBox>
      </div>
    </>
  );
};
