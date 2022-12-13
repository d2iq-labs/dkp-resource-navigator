import { PageHeader, Table } from '@d2iq/ui-kit';
import { Resource } from 'models/resources';

type ResourceTableProps = {
  resources: Resource[];
};

export const ResourcesTable = ({ resources }: ResourceTableProps) => {
  const columns = [
    {
      id: 'name',
      header: 'Name',
      render: ({ name, apiVersion }: Resource) => (
        <div
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
      <PageHeader
        breadcrumbElements={['Resources']}
      />
      <Table
        data={resources}
        columns={columns}
        toId={(el: Resource) => el.name ?? ''}
        initialSorter={{ by: 'name', order: 'asc' }}
      />
    </>
  );
};
