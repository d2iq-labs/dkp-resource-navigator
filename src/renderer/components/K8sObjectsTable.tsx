import { Table } from '@d2iq/ui-kit';
import { KubernetesObject } from '@kubernetes/client-node';
// import { Resource as KubernetesObject } from 'models/resources';

type K8sObjectTableProps = {
  k8sObjects: KubernetesObject[];
};

export const K8sObjectsTable = ({ k8sObjects }: K8sObjectTableProps) => {
  // const [resourceObjects, setResourceObjects] = useState<KubernetesObject[]>([])
  const columns = [
    {
      id: 'name',
      header: 'Name',
      render: ({ metadata }: KubernetesObject) => <>{metadata?.name}</>,
    },
  ];

  return (
    <Table
      data={k8sObjects}
      columns={columns}
      toId={(el: KubernetesObject) => el.metadata?.name ?? ''}
      initialSorter={{ by: 'name', order: 'asc' }}
    />
  );
};
