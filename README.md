# chubbyts-petstore

[![CI](https://github.com/chubbyts/chubbyts-petstore/workflows/CI/badge.svg?branch=master)](https://github.com/chubbyts/chubbyts-petstore/actions?query=workflow%3ACI)
[![Coverage Status](https://coveralls.io/repos/github/chubbyts/chubbyts-petstore/badge.svg?branch=master)](https://coveralls.io/github/chubbyts/chubbyts-petstore?branch=master)
[![Infection MSI](https://badge.stryker-mutator.io/github.com/chubbyts/chubbyts-petstore/master)](https://dashboard.stryker-mutator.io/reports/github.com/chubbyts/chubbyts-petstore/master)

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

An api skeleton using mongodb for [chubbyts-framework][7].

## Requirements

 * node: 14
 * [@chubbyts/chubbyts-api][1]: ^1.1.0
 * [@chubbyts/chubbyts-cors][2]: ^1.0.3
 * [@chubbyts/chubbyts-decode-encode][3]: ^1.1.0
 * [@chubbyts/chubbyts-dic][4]: ^1.0.2
 * [@chubbyts/chubbyts-dic-config][5]: ^1.0.2
 * [@chubbyts/chubbyts-dic-types][6]: ^1.0.0
 * [@chubbyts/chubbyts-framework][7]: ^1.3.0
 * [@chubbyts/chubbyts-framework-router-path-to-regexp][8]: ^1.0.2
 * [@chubbyts/chubbyts-http][9]: ^1.0.0
 * [@chubbyts/chubbyts-http-error][10]: ^1.0.0
 * [@chubbyts/chubbyts-http-types][11]: ^1.0.0
 * [@chubbyts/chubbyts-log-types][12]: ^1.0.0
 * [@chubbyts/chubbyts-mongodb][13]: ^1.0.0
 * [@chubbyts/chubbyts-negotiation][14]: ^3.0.0
 * [@chubbyts/chubbyts-node-http-bridge][15]: ^1.0.0
 * [@chubbyts/chubbyts-pino-adapter][16]: ^1.0.0
 * [commander][17]: ^9.3.0
 * [get-stream][18]: ^6.0.1
 * [mongodb][19]: ^4.7.0
 * [pino][20]: ^7.11.0
 * [uuid][21]: ^8.3.2
 * [zod][22]: ^3.17.3

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

* GET https://localhost:10443/ping

### Pet

* GET https://localhost:10443/api/pets?sort[name]=asc
* POST https://localhost:10443/api/pets
* GET https://localhost:10443/api/pets/8ba9661b-ba7f-436b-bd25-c0606f911f7d
* PUT https://localhost:10443/api/pets/8ba9661b-ba7f-436b-bd25-c0606f911f7d
* DELETE https://localhost:10443/api/pets/8ba9661b-ba7f-436b-bd25-c0606f911f7d

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

## Copyright

Dominik Zogg 2022

[1]: https://www.npmjs.com/package/@chubbyts/chubbyts-api
[2]: https://www.npmjs.com/package/@chubbyts/chubbyts-cors
[3]: https://www.npmjs.com/package/@chubbyts/chubbyts-decode-encode
[4]: https://www.npmjs.com/package/@chubbyts/chubbyts-dic
[5]: https://www.npmjs.com/package/@chubbyts/chubbyts-dic-config
[6]: https://www.npmjs.com/package/@chubbyts/chubbyts-dic-types
[7]: https://www.npmjs.com/package/@chubbyts/chubbyts-framework
[8]: https://www.npmjs.com/package/@chubbyts/chubbyts-framework-router-path-to-regexp
[9]: https://www.npmjs.com/package/@chubbyts/chubbyts-http
[10]: https://www.npmjs.com/package/@chubbyts/chubbyts-http-error
[11]: https://www.npmjs.com/package/@chubbyts/chubbyts-http-types
[12]: https://www.npmjs.com/package/@chubbyts/chubbyts-log-types
[13]: https://www.npmjs.com/package/@chubbyts/chubbyts-mongodb
[14]: https://www.npmjs.com/package/@chubbyts/chubbyts-negotiation
[15]: https://www.npmjs.com/package/@chubbyts/chubbyts-node-http-bridge
[16]: https://www.npmjs.com/package/@chubbyts/chubbyts-pino-adapter
[17]: https://www.npmjs.com/package/commander
[18]: https://www.npmjs.com/package/get-stream
[19]: https://www.npmjs.com/package/mongodb
[20]: https://www.npmjs.com/package/pino
[21]: https://www.npmjs.com/package/uuid
[22]: https://www.npmjs.com/package/zod

[30]: src/command.ts
[31]: src/handler.ts
[32]: src/model.ts
[33]: src/pet/model.ts
[34]: src/repository.ts
[35]: src/service-factory.ts
[36]: src/pet/service-factory.ts
