import { PrimaryButton, Table } from '@d2iq/ui-kit';
import { KubernetesObject } from '@kubernetes/client-node';
// import { Resource as KubernetesObject } from 'models/resources';

type K8sObjectTableProps = {
  k8sObjects: KubernetesObject[];
  onEditObject: (object: KubernetesObject) => void;
};

export const K8sObjectsTable = ({
  k8sObjects,
  onEditObject,
}: K8sObjectTableProps) => {
  // const [resourceObjects, setResourceObjects] = useState<KubernetesObject[]>([])
  const columns = [
    {
      id: 'name',
      header: 'Name',
      render: ({ metadata }: KubernetesObject) => <div>{metadata?.name}</div>,
    },
    {
      id: 'edit',
      header: 'Edit',
      render: (object: KubernetesObject) => (
        <PrimaryButton onClick={() => onEditObject(object)}>Edit</PrimaryButton>
      ),
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
