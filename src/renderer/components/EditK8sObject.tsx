import { PageHeader, PrimaryButton, Table } from '@d2iq/ui-kit';
import { KubernetesObject } from '@kubernetes/client-node';
import CodeEditorInput from './CodeEditorInput';

type EditK8sObjectProps = {
  k8sObject: KubernetesObject;
  k8sObjectYaml: string;
  onCancelEditObject: () => void;
  onCancelViewObjects: () => void;
};

export const EditK8sObject = ({
  k8sObject,
  k8sObjectYaml,
  onCancelEditObject,
  onCancelViewObjects,
}: EditK8sObjectProps) => {
  const resetToResources = () => {
    onCancelEditObject();
    onCancelViewObjects();
  };
  return (
    <>
      <PageHeader
        breadcrumbElements={[
          <div key="resources" onClick={resetToResources}>Resources</div>,
          <div key={k8sObject.kind} onClick={onCancelEditObject}>{k8sObject.kind}</div>,
          `Edit ${k8sObject.metadata?.name}`,
        ]}
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
