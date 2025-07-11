# chubbyts-petstore

[![CI](https://github.com/chubbyts/chubbyts-petstore/workflows/CI/badge.svg?branch=master)](https://github.com/chubbyts/chubbyts-petstore/actions?query=workflow%3ACI)
[![Coverage Status](https://coveralls.io/repos/github/chubbyts/chubbyts-petstore/badge.svg?branch=master)](https://coveralls.io/github/chubbyts/chubbyts-petstore?branch=master)
[![Mutation testing badge](https://img.shields.io/endpoint?style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fchubbyts%2Fchubbyts-petstore%2Fmaster)](https://dashboard.stryker-mutator.io/reports/github.com/chubbyts/chubbyts-petstore/master)

[![bugs](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-petstore&metric=bugs)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-petstore)
[![code_smells](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-petstore&metric=code_smells)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-petstore)
[![coverage](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-petstore&metric=coverage)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-petstore)
[![duplicated_lines_density](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-petstore&metric=duplicated_lines_density)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-petstore)
[![ncloc](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-petstore&metric=ncloc)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-petstore)
[![sqale_rating](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-petstore&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-petstore)
[![alert_status](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-petstore&metric=alert_status)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-petstore)
[![reliability_rating](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-petstore&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-petstore)
[![security_rating](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-petstore&metric=security_rating)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-petstore)
[![sqale_index](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-petstore&metric=sqale_index)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-petstore)
[![vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-petstore&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-petstore)

## Description

An api skeleton using mongodb for [chubbyts-framework][8].

## Requirements

 * node: 18
 * [@asteasolutions/zod-to-openapi][1]: ^7.3.4
 * [@chubbyts/chubbyts-api][2]: ^5.2.9
 * [@chubbyts/chubbyts-decode-encode][3]: ^2.0.1
 * [@chubbyts/chubbyts-dic][4]: ^2.0.1
 * [@chubbyts/chubbyts-dic-config][5]: ^2.0.1
 * [@chubbyts/chubbyts-dic-types][6]: ^2.0.1
 * [@chubbyts/chubbyts-framework][7]: ^2.0.1
 * [@chubbyts/chubbyts-framework-router-path-to-regexp][8]: ^2.0.2
 * [@chubbyts/chubbyts-http][9]: ^2.0.1
 * [@chubbyts/chubbyts-http-cors][10]: ^2.0.1
 * [@chubbyts/chubbyts-http-error][11]: ^3.0.1
 * [@chubbyts/chubbyts-http-node-bridge][12]: ^2.0.1
 * [@chubbyts/chubbyts-http-types][13]: ^3.0.1
 * [@chubbyts/chubbyts-log-types][14]: ^3.0.1
 * [@chubbyts/chubbyts-mongodb][15]: ^2.0.1
 * [@chubbyts/chubbyts-negotiation][16]: ^4.0.2
 * [@chubbyts/chubbyts-pino-adapter][17]: ^3.0.1
 * [commander][18]: ^14.0.0
 * [mongodb][19]: ^6.17.0
 * [openapi3-ts][20]: ^4.5.0
 * [pino][21]: ^9.7.0
 * [uuid][22]: ^11.1.0
 * [zod][23]: ^3.25.64

## Environment

Add the following environment variable to your system, for example within `~/.bashrc`:

```sh
export USER_ID=$(id -u)
export GROUP_ID=$(id -g)
```

### Docker

```sh
docker-compose up -d
docker-compose exec node bash
```

## Start

```sh
pnpm start
```

## Urls

* GET https://localhost/ping
* GET https://localhost/swagger (https://localhost/openapi)

### Pet

* GET https://localhost/api/pets?sort[name]=asc
* POST https://localhost/api/pets
* GET https://localhost/api/pets/8ba9661b-ba7f-436b-bd25-c0606f911f7d
* PUT https://localhost/api/pets/8ba9661b-ba7f-436b-bd25-c0606f911f7d
* DELETE https://localhost/api/pets/8ba9661b-ba7f-436b-bd25-c0606f911f7d

## Structure

### Command

Commands is code that is meant to be executed on command line.

 * [src/command.ts][30]

### Handler

Handler alias Controller, or Controller actions to be more precise.

 * [src/handler.ts][31]
### Model

Models, entities, documents what ever fits your purpose the best.

 * [src/model.ts][32]
 * [src/pet/model.ts][33]

### Repository

Repositories get data from storages like databases, opensearch, redis or whereever your models are stored or cached.

 * [src/repository.ts][34]

### ServiceFactory

Service factories are the glue code of the dependeny injection container.

 * [src/service-factory.ts][35]
 * [src/pet/service-factory.ts][36]

## Deployment

### Setup

 * [Digitalocean](https://cloud.digitalocean.com/)
 * [Create digitalocean token](https://cloud.digitalocean.com/account/api/tokens)
 * [Install digitalocean cli - doctl](https://docs.digitalocean.com/reference/doctl/how-to/install/)
 * [Pulumi](https://app.pulumi.com/)
 * [Install pulumi cli - pulumi](https://www.pulumi.com/docs/get-started/install/)
 * [Install kubernetes cli - kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl)

### Deployment

```sh
cd pulumi
pnpm install
pulumi config set digitalocean:token XXXXXXXXXXXXXX --secret
pulumi config set chubbyts-petstore:cert-manager-email XXXXXXXXXXXXXX --secret
pulumi config set chubbyts-petstore:ip-range 10.10.11.0/24
pulumi config set chubbyts-petstore:k8s-node-Count: "1"
pulumi config set chubbyts-petstore:mongodb-node-Count: "1"
pulumi config set chubbyts-petstore:opensearch-node-Count: "1"
pulumi up
```

### Docker registry login

```sh
doctl registry login
```

### Kubectl config

```sh
doctl kubernetes clusters list
doctl kubernetes clusters kubeconfig save <clustername>
```

### Important kubectl commands

```sh
# lists all deployments: container definition(s) which provide(s) howto start a pod
kubectl get deployments

# show the current deployment definition
kubectl get deployment <deploymentname> -o yaml

# edit the current deployment defintion (should be done via code change and pulumi up, and not inline)
kubectl edit deployment <deploymentname>

# lists all pods: container(s) which provide(s) one application for example the cms
kubectl get pods

# show the current pod definition (do not edit!)
kubectl get pod <podname> -o yaml

# enter a pod
kubectl exec -it <podname> -- /bin/bash
```

### Debug production build

Make sure the development version is running to reuse its mongodb instance.

```sh
docker build --platform=linux/amd64 -f ./docker/production/node/Dockerfile -t chubbyts-petstore-node .
docker run -it -e NODE_ENV=production -e MONGO_URI="<see docker-compose.yml, replace @mongo with @host.docker.internal>" -e SERVER_HOST=0.0.0.0 -e SERVER_PORT=3000 -p 3000:3000 chubbyts-petstore-node
```

## Copyright

2025 Dominik Zogg

[1]: https://www.npmjs.com/package/@asteasolutions/zod-to-openapi
[2]: https://www.npmjs.com/package/@chubbyts/chubbyts-api
[3]: https://www.npmjs.com/package/@chubbyts/chubbyts-decode-encode
[4]: https://www.npmjs.com/package/@chubbyts/chubbyts-dic
[5]: https://www.npmjs.com/package/@chubbyts/chubbyts-dic-config
[6]: https://www.npmjs.com/package/@chubbyts/chubbyts-dic-types
[7]: https://www.npmjs.com/package/@chubbyts/chubbyts-framework
[8]: https://www.npmjs.com/package/@chubbyts/chubbyts-framework-router-path-to-regexp
[9]: https://www.npmjs.com/package/@chubbyts/chubbyts-http
[10]: https://www.npmjs.com/package/@chubbyts/chubbyts-http-cors
[11]: https://www.npmjs.com/package/@chubbyts/chubbyts-http-error
[12]: https://www.npmjs.com/package/@chubbyts/chubbyts-http-node-bridge
[13]: https://www.npmjs.com/package/@chubbyts/chubbyts-http-types
[14]: https://www.npmjs.com/package/@chubbyts/chubbyts-log-types
[15]: https://www.npmjs.com/package/@chubbyts/chubbyts-mongodb
[16]: https://www.npmjs.com/package/@chubbyts/chubbyts-negotiation
[17]: https://www.npmjs.com/package/@chubbyts/chubbyts-pino-adapter
[18]: https://www.npmjs.com/package/commander
[19]: https://www.npmjs.com/package/mongodb
[20]: https://www.npmjs.com/package/openapi3-ts
[21]: https://www.npmjs.com/package/pino
[22]: https://www.npmjs.com/package/uuid
[23]: https://www.npmjs.com/package/zod

[30]: src/command.ts
[31]: src/handler.ts
[32]: src/model.ts
[33]: src/pet/model.ts
[34]: src/repository.ts
[35]: src/service-factory.ts
[36]: src/pet/service-factory.ts
