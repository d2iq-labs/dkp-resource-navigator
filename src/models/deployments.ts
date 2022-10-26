export interface Deployment {
  name?: string;
  image?: string;
  replicas: number;
  status: Status;
}

export enum Status {
  Unknown = 'Unknown',
  Unavailable = 'Unavailable',
  Available = 'Available',
}
