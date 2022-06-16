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

An api skeleton using mongodb for [chubbyts-framework][6].

## Requirements

 * node: 14
 * [@chubbyts/chubbyts-api][1]: ^1.0.2
 * [@chubbyts/chubbyts-decode-encode][2]: ^1.0.2
 * [@chubbyts/chubbyts-dic][3]: ^1.0.2
 * [@chubbyts/chubbyts-dic-config][4]: ^1.0.2
 * [@chubbyts/chubbyts-dic-types][5]: ^1.0.0
 * [@chubbyts/chubbyts-framework][6]: ^1.1.4
 * [@chubbyts/chubbyts-framework-router-path-to-regexp][7]: ^1.0.2
 * [@chubbyts/chubbyts-http][8]: ^1.0.0
 * [@chubbyts/chubbyts-http-error][9]: ^1.0.0
 * [@chubbyts/chubbyts-http-types][10]: ^1.0.0
 * [@chubbyts/chubbyts-log-types][11]: ^1.0.0
 * [@chubbyts/chubbyts-negotiation][12]: ^3.0.0
 * [@chubbyts/chubbyts-pino-adapter][13]: ^1.0.0
 * [commander][14]: ^9.3.0
 * [get-stream][15]: ^6.0.1
 * [mongodb][16]: ^4.6.0
 * [pino][17]: ^7.11.0
 * [uuid][18]: ^8.3.2
 * [zod][19]: ^3.17.3

## Installation

```sh
git clone https://github.com/chubbyts/chubbyts-petstore.git
cd chubbyts-petstore
rm -rf .git
npm install
npm start
```

## Structure

### Command

Commands is code that is meant to be executed on command line.

 * [src/command.ts][20]

### Handler

Handler alias Controller, or Controller actions to be more precise.

 * [src/handler.ts][21]

### Model

Models, entities, documents what ever fits your purpose the best.

 * [src/model.ts][22]

### Repository

Repositories get data from storages like databases, elasticsearch, redis or whereever your models are stored or cached.

 * [src/repository.ts][23]

### ServiceFactory

Service factories are the glue code of the dependeny injection container.

 * [src/service-factory.ts][24]

## Copyright

Dominik Zogg 2022

[1]: https://www.npmjs.com/package/@chubbyts/chubbyts-api
[2]: https://www.npmjs.com/package/@chubbyts/chubbyts-decode-encode
[3]: https://www.npmjs.com/package/@chubbyts/chubbyts-dic
[4]: https://www.npmjs.com/package/@chubbyts/chubbyts-dic-config
[5]: https://www.npmjs.com/package/@chubbyts/chubbyts-dic-types
[6]: https://www.npmjs.com/package/@chubbyts/chubbyts-framework
[7]: https://www.npmjs.com/package/@chubbyts/chubbyts-framework-router-path-to-regexp
[8]: https://www.npmjs.com/package/@chubbyts/chubbyts-http
[9]: https://www.npmjs.com/package/@chubbyts/chubbyts-http-error
[10]: https://www.npmjs.com/package/@chubbyts/chubbyts-http-types
[11]: https://www.npmjs.com/package/@chubbyts/chubbyts-log-types
[12]: https://www.npmjs.com/package/@chubbyts/chubbyts-negotiation
[13]: https://www.npmjs.com/package/@chubbyts/chubbyts-pino-adapter
[14]: https://www.npmjs.com/package/commander
[15]: https://www.npmjs.com/package/get-stream
[16]: https://www.npmjs.com/package/mongodb
[17]: https://www.npmjs.com/package/pino
[18]: https://www.npmjs.com/package/uuid
[19]: https://www.npmjs.com/package/zod

[20]: src/command.ts
[21]: src/handler.ts
[22]: src/model.ts
[23]: src/repository.ts
[24]: src/service-factory.ts
