import { PageHeader, PrimaryButton, Table } from '@d2iq/ui-kit';
import { KubernetesObject } from '@kubernetes/client-node';

type K8sObjectTableProps = {
  k8sObjects: KubernetesObject[];
  onEditObject: (object: KubernetesObject | null) => void;
  onCancelViewObjects: () => void;
};

export const K8sObjectsTable = ({
  k8sObjects,
  onEditObject,
  onCancelViewObjects,
}: K8sObjectTableProps) => {
  const columns = [
    {
      id: 'name',
      header: 'Name',
      render: ({ metadata }: KubernetesObject) => <div>{metadata?.name}</div>,
    },
    {
      id: 'namespace',
      header: 'Namespace',
      render: ({ metadata }: KubernetesObject) => <>{metadata?.namespace}</>,
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
    <>
      <PageHeader
        breadcrumbElements={[
          <div key="resources" onClick={onCancelViewObjects}>Resources</div>,
          k8sObjects[0].kind,
        ]}
        actions={[
          <PrimaryButton
            type="button"
            onClick={onCancelViewObjects}
          >
            Go Back
          </PrimaryButton>,
        ]}
      />
      <Table
        data={k8sObjects}
        columns={columns}
        toId={(el: KubernetesObject) => el.metadata?.name ?? ''}
        initialSorter={{ by: 'name', order: 'asc' }}
      />
    </>
  );
};
