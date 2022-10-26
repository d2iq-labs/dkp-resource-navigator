import { Table } from '@dcos/ui-kit';
import { Deployment } from 'models/deployments';

type DeploymentTableProps = {
  deployments: Deployment[];
};

export const DeploymentsTable = ({ deployments }: DeploymentTableProps) => {
  const columns = [
    {
      id: 'name',
      header: 'Name',
      render: ({ name }: Deployment) => <>{name}</>,
    },
    {
      id: 'image',
      header: 'Image',
      render: ({ image }: Deployment) => <>{image}</>,
    },
    {
      id: 'status',
      header: 'Status',
      render: ({ status }: Deployment) => <>{status}</>,
    },
  ];

  return (
    <Table
      data={deployments}
      columns={columns}
      toId={(el: Deployment) => el.name ?? ''}
      initialSorter={{ by: 'name', order: 'asc' }}
    />
  );
};
