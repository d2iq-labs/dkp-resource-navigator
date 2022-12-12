### Prerequisites

Node version: `>=16.16.x`
NPM version: `>=8.15.0`

### Instructions

`npm install`

Install Kind:

`brew install kind`

Create a Cluster:

`kind create cluster`

`npm run start`

### Get the kubeconfig for the KIND cluster

`kind get kubeconfig > kind.conf`

`export KUBECONFIG=kind.conf`

### Template

https://github.com/electron-react-boilerplate/electron-react-boilerplate

### Manually add a Deployment

```bash
kubectl create deployment hello-node --image=registry.k8s.io/echoserver:1.4
```
