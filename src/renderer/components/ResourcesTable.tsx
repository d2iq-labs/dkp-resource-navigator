import { designTokens, PageHeader, Table } from '@d2iq/ui-kit';
import { css } from '@emotion/css';
import { Resource } from 'models/resources';

type ResourceTableProps = {
  resources: Resource[];
};

const LinkStyle = css`
  cursor: pointer;
  color: ${designTokens.purple};
`;

export const ResourcesTable = ({ resources }: ResourceTableProps) => {
  const columns = [
    {
      id: 'name',
      header: 'Name',
      render: ({ name, apiVersion }: Resource) => (
        <div
          className={LinkStyle}
          onClick={() =>
            window.electron.ipcRenderer.requestSpecificResources(
              apiVersion,
              name
            )
          }
        >
          {name}
        </div>
      ),
    },
    {
      id: 'apiVersion',
      header: 'ApiVersion',
      render: ({ apiVersion }: Resource) => <>{apiVersion}</>,
    },
    {
      id: 'kind',
      header: 'Kind',
      render: ({ kind }: Resource) => <>{kind}</>,
    },
    {
      id: 'namespaced',
      header: 'Namespaced',
      render: ({ namespaced }: Resource) => <>{namespaced.toString()}</>,
    },
  ];

  return (
    <>
      <PageHeader breadcrumbElements={['Resources']} />
      <Table
        data={resources}
        columns={columns}
        toId={(el: Resource) => el.name ?? ''}
        initialSorter={{ by: 'name', order: 'asc' }}
      />
    </>
  );
};
