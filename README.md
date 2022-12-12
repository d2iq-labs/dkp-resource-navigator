### Prerequisites

Node version: `>=14.x`
NPM version: `>=7.x`

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

kubectl create deployment hello-node --image=registry.k8s.io/echoserver:1.4
