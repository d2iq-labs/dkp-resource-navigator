import { PrimaryButton, Table } from '@d2iq/ui-kit';
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
    {
      id: 'portForward',
      header: 'Actions',
      render: ({ name }: Deployment) => (
        <PrimaryButton
          onClick={() => {
            console.log(name);
            window.electron.ipcRenderer.portForward(name ?? '');
          }}
        >
          Port Forward
        </PrimaryButton>
      ),
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
