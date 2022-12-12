export interface Resource {
  name: string;
  kind: string;
  namespaced: boolean;
  singularName: string;
  verbs: string[];
}
