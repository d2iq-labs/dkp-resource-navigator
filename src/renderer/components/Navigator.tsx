import * as yaml from 'js-yaml';
import { SpacingBox, PageHeader } from '@d2iq/ui-kit';
import { KubernetesObject } from '@kubernetes/client-node';

import { Resource } from 'models/resources';
import { useEffect, useState } from 'react';
import { ResourcesTable } from './ResourcesTable';
import { K8sObjectsTable } from './K8sObjectsTable';
import { EditK8sObject } from './EditK8sObject';

export const Navigator = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [k8sObjects, setK8sObjects] = useState<KubernetesObject[] | null>();
  const [editK8sObject, setEditK8sObject] = useState<KubernetesObject | null>();

  const getResources = () => {
    window.electron.ipcRenderer.requestResources();
  };

  useEffect(() => {
    const createSubscriptions = async () => {
      window.electron.ipcRenderer.receiveResources((data: Resource[]) => {
        setResources(data ?? []);
      });
      window.electron.ipcRenderer.receiveSpecificResources(
        (data: KubernetesObject[]) => {
          setK8sObjects(data ?? []);
        }
      );
    };
    createSubscriptions();
    getResources();
  }, []);

  const onEditObject = (object: KubernetesObject | null) => {
    setEditK8sObject(object);
  };

  const onCancelViewObjects = () => {
    setK8sObjects(null);
  };

  const onCancelEditObject = () => {
    setEditK8sObject(null);
  };

  const viewHandler = () => {
    if (editK8sObject) {
      delete editK8sObject.metadata?.managedFields;
      let k8sObjectYaml: string = yaml.dump(editK8sObject, {
        schema: yaml.JSON_SCHEMA,
      });
      return (
        <EditK8sObject
          k8sObject={editK8sObject}
          k8sObjectYaml={k8sObjectYaml}
          onCancelEditObject={onCancelEditObject}
          onCancelViewObjects={onCancelViewObjects}
        />
      );
    }
    if (k8sObjects) {
      return (
        <K8sObjectsTable
          k8sObjects={k8sObjects}
          onEditObject={onEditObject}
          onCancelViewObjects={onCancelViewObjects}
        />
      );
    } else return <ResourcesTable resources={resources} />;
  };
  const breadCrumbs = k8sObjects?.length ? [k8sObjects[0].kind] : [];
  return (
    <div>
      <SpacingBox>{viewHandler()}</SpacingBox>
    </div>
  );
};
