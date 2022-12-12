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

const nanoid = customAlphabet('1234567890abcdefgh', 10);

export const ResourcesView = () => {
  const [resources, setResources] = useState<Resource[]>([]);
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

  return (
    <>
      <PageHeader
        breadcrumbElements={['Resources']}
        actions={[
          <PrimaryButton type="button" onClick={getResources}>
            Get Resources
          </PrimaryButton>,
        ]}
      />
      <div>
        <SpacingBox>
          <ResourcesTable resources={resources} />
        </SpacingBox>
      </div>
    </>
  );
};
