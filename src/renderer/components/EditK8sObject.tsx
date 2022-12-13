import { PageHeader, PrimaryButton, Table } from '@d2iq/ui-kit';
import { KubernetesObject } from '@kubernetes/client-node';
import CodeEditorInput from './CodeEditorInput';

type EditK8sObjectProps = {
  k8sObjectYaml: string;
  onCancelEditObject: () => void;
};

export const EditK8sObject = ({
  k8sObjectYaml,
  onCancelEditObject,
}: EditK8sObjectProps) => {
  return (
    <>
      <PageHeader
        breadcrumbElements={['Edit Object']}
        actions={[
          <PrimaryButton type="button" onClick={onCancelEditObject}>
            Go Back
          </PrimaryButton>,
        ]}
      />
       <CodeEditorInput uploadButtonContent={true} value={k8sObjectYaml} />
    </>
  );
};
