export interface Resource {
  name: string;
  kind: string;
  apiVersion: string;
  namespaced: boolean;
  singularName: string;
  verbs: string[];
}
