import { Table } from '@d2iq/ui-kit';
import { Resource } from 'models/resources';

type ResourceTableProps = {
  resources: Resource[];
};

export const ResourcesTable = ({ resources }: ResourceTableProps) => {
  const columns = [
    {
      id: 'name',
      header: 'Name',
      render: ({ name }: Resource) => <>{name}</>,
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
    <Table
      data={resources}
      columns={columns}
      toId={(el: Resource) => el.name ?? ''}
      initialSorter={{ by: 'name', order: 'asc' }}
    />
  );
};
