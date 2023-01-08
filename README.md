# chubbyts-petstore

[![CI](https://github.com/chubbyts/chubbyts-petstore/workflows/CI/badge.svg?branch=master)](https://github.com/chubbyts/chubbyts-petstore/actions?query=workflow%3ACI)
[![Coverage Status](https://coveralls.io/repos/github/chubbyts/chubbyts-petstore/badge.svg?branch=master)](https://coveralls.io/github/chubbyts/chubbyts-petstore?branch=master)

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

 * node: 14
 * [@asteasolutions/zod-to-openapi][1]: ^4.0.0
 * [@chubbyts/chubbyts-api][2]: ^2.2.0
 * [@chubbyts/chubbyts-cors][3]: ^1.0.3
 * [@chubbyts/chubbyts-decode-encode][4]: ^1.1.1
 * [@chubbyts/chubbyts-dic][5]: ^1.0.2
 * [@chubbyts/chubbyts-dic-config][6]: ^1.0.2
 * [@chubbyts/chubbyts-dic-types][7]: ^1.0.0
 * [@chubbyts/chubbyts-framework][8]: ^1.6.3
 * [@chubbyts/chubbyts-framework-router-path-to-regexp][9]: ^1.2.0
 * [@chubbyts/chubbyts-http][10]: ^1.0.1
 * [@chubbyts/chubbyts-http-error][11]: ^2.0.1
 * [@chubbyts/chubbyts-http-types][12]: ^1.0.0
 * [@chubbyts/chubbyts-log-types][13]: ^1.0.0
 * [@chubbyts/chubbyts-mongodb][14]: ^1.0.1
 * [@chubbyts/chubbyts-negotiation][15]: ^3.0.0
 * [@chubbyts/chubbyts-node-http-bridge][16]: ^1.0.0
 * [@chubbyts/chubbyts-pino-adapter][17]: ^1.1.1
 * [commander][18]: ^9.4.1
 * [mongodb][19]: ^4.13.0
 * [openapi3-ts][20]: ^3.1.2
 * [pino][21]: ^8.8.0
 * [uuid][22]: ^9.0.0
 * [zod][23]: ^3.20.2

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

## Installation

```sh
npm install
npm start
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

Repositories get data from storages like databases, elasticsearch, redis or whereever your models are stored or cached.

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
npm install
pulumi config set digitalocean:token XXXXXXXXXXXXXX --secret
pulumi config set chubbyts-petstore:certManagerEmail XXXXXXXXXXXXXX --secret
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

###

## Copyright

2023 Dominik Zogg

[1]: https://www.npmjs.com/package/@asteasolutions/zod-to-openapi
[2]: https://www.npmjs.com/package/@chubbyts/chubbyts-api
[3]: https://www.npmjs.com/package/@chubbyts/chubbyts-cors
[4]: https://www.npmjs.com/package/@chubbyts/chubbyts-decode-encode
[5]: https://www.npmjs.com/package/@chubbyts/chubbyts-dic
[6]: https://www.npmjs.com/package/@chubbyts/chubbyts-dic-config
[7]: https://www.npmjs.com/package/@chubbyts/chubbyts-dic-types
[8]: https://www.npmjs.com/package/@chubbyts/chubbyts-framework
[9]: https://www.npmjs.com/package/@chubbyts/chubbyts-framework-router-path-to-regexp
[10]: https://www.npmjs.com/package/@chubbyts/chubbyts-http
[11]: https://www.npmjs.com/package/@chubbyts/chubbyts-http-error
[12]: https://www.npmjs.com/package/@chubbyts/chubbyts-http-types
[13]: https://www.npmjs.com/package/@chubbyts/chubbyts-log-types
[14]: https://www.npmjs.com/package/@chubbyts/chubbyts-mongodb
[15]: https://www.npmjs.com/package/@chubbyts/chubbyts-negotiation
[16]: https://www.npmjs.com/package/@chubbyts/chubbyts-node-http-bridge
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
