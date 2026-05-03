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

An api skeleton using postgres for [chubbyts-framework][6].

## Requirements

 * node: 22
 * [@asteasolutions/zod-to-openapi][1]: ^8.5.0
 * [@chubbyts/chubbyts-decode-encode][2]: ^2.2.1
 * [@chubbyts/chubbyts-dic][3]: ^2.1.1
 * [@chubbyts/chubbyts-dic-config][4]: ^2.1.1
 * [@chubbyts/chubbyts-dic-types][5]: ^2.1.1
 * [@chubbyts/chubbyts-framework][6]: ^3.1.2
 * [@chubbyts/chubbyts-framework-router-path-to-regexp][7]: ^3.1.2
 * [@chubbyts/chubbyts-http-error][8]: ^3.2.1
 * [@chubbyts/chubbyts-log-types][9]: ^3.1.1
 * [@chubbyts/chubbyts-negotiation][10]: ^4.1.1
 * [@chubbyts/chubbyts-pino-adapter][11]: ^3.1.1
 * [@chubbyts/chubbyts-undici-api][12]: ^2.0.1
 * [@chubbyts/chubbyts-undici-cors][13]: ^1.1.2
 * [@chubbyts/chubbyts-undici-server][14]: ^1.1.2
 * [@chubbyts/chubbyts-undici-server-node][15]: ^1.1.2
 * [commander][16]: ^14.0.3
 * [drizzle-orm][17]: ^0.45.2
 * [openapi3-ts][18]: ^4.5.0
 * [pg][19]: ^8.20.0
 * [pino][20]: ^10.3.1
 * [uuid][21]: ^14.0.0
 * [zod][22]: ^4.4.2

## Environment

Add the following environment variable to your system, for example within `~/.bashrc` or  `~/.zshrc`:

```sh
export USER_ID=$(id -u)
export GROUP_ID=$(id -g)
```

Make sure all the mount points are given

```sh
touch ~/.bash_docker
touch ~/.bash_history
```

```sh
touch ~/.gitconfig
touch ~/.gitignore
```

```sh
mkdir -p ~/.config/opencode
[ ! -f ~/.local/share/opencode/auth.json ] && echo '{}' > ~/.config/opencode/tui.json
mkdir -p ~/.local/share/opencode
[ ! -f ~/.local/share/opencode/auth.json ] && echo '{}' > ~/.local/share/opencode/auth.json
```

```sh
touch ~/.zsh_docker
touch ~/.zsh_history
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
* GET https://localhost/api/pets/019c201f-6a83-7696-9899-50fbf7b2278d
* PUT https://localhost/api/pets/019c201f-6a83-7696-9899-50fbf7b2278d
* DELETE https://localhost/api/pets/019c201f-6a83-7696-9899-50fbf7b2278d

## Structure

### Command

Commands is code that is meant to be executed on command line.

 * [src/command.ts][30]

### Handler

Handler alias Controller, or Controller actions to be more precise.

 * [src/handler.ts][31]
### Model

Models, entities, documents what ever fits your purpose the best.

 * [src/pet/model.ts][32]

### Repository

Repositories get data from storages like databases, opensearch, redis or whereever your models are stored or cached.

 * [src/repository.ts][33]

### ServiceFactory

Service factories are the glue code of the dependeny injection container.

 * [src/service-factory.ts][34]
 * [src/pet/service-factory.ts][35]

## Opensearch

### Policy to delete logstash formatted indicies after 14 days.

```.sh
curl -XPUT 'https://localhost:9200/_plugins/_ism/policies/logstash-policy' \
    -u 'admin:t9V02zfj!NMj?LugFsOi' \
    -H 'Content-Type: application/json' \
    -H 'Accept: application/json' \
    -d '{
      "policy": {
        "description": "Logstash",
        "default_state": "hot",
        "states": [
          {
            "name": "hot",
            "actions": [],
            "transitions": [
              {
                "state_name": "delete",
                "conditions": {
                  "min_index_age": "14d"
                }
              }
            ]
          },
          {
            "name": "delete",
            "actions": [
              {
                "delete": {}
              }
            ]
          }
        ],
        "ism_template": {
          "index_patterns" : ["logstash-*"],
          "priority": 100
        }
      }
    }' \
    --insecure
```

## Copyright

2026 Dominik Zogg

[1]: https://www.npmjs.com/package/@asteasolutions/zod-to-openapi
[2]: https://www.npmjs.com/package/@chubbyts/chubbyts-decode-encode
[3]: https://www.npmjs.com/package/@chubbyts/chubbyts-dic
[4]: https://www.npmjs.com/package/@chubbyts/chubbyts-dic-config
[5]: https://www.npmjs.com/package/@chubbyts/chubbyts-dic-types
[6]: https://www.npmjs.com/package/@chubbyts/chubbyts-framework
[7]: https://www.npmjs.com/package/@chubbyts/chubbyts-framework-router-path-to-regexp
[8]: https://www.npmjs.com/package/@chubbyts/chubbyts-http-error
[9]: https://www.npmjs.com/package/@chubbyts/chubbyts-log-types
[10]: https://www.npmjs.com/package/@chubbyts/chubbyts-negotiation
[11]: https://www.npmjs.com/package/@chubbyts/chubbyts-pino-adapter
[12]: https://www.npmjs.com/package/@chubbyts/chubbyts-undici-api
[13]: https://www.npmjs.com/package/@chubbyts/chubbyts-undici-cors
[14]: https://www.npmjs.com/package/@chubbyts/chubbyts-undici-server
[15]: https://www.npmjs.com/package/@chubbyts/chubbyts-undici-server-node
[16]: https://www.npmjs.com/package/commander
[17]: https://www.npmjs.com/package/drizzle-orm
[18]: https://www.npmjs.com/package/openapi3-ts
[19]: https://www.npmjs.com/package/pino
[20]: https://www.npmjs.com/package/pg
[21]: https://www.npmjs.com/package/uuid
[22]: https://www.npmjs.com/package/zod

[30]: src/command.ts
[31]: src/handler.ts
[32]: src/pet/model.ts
[33]: src/repository.ts
[34]: src/service-factory.ts
[35]: src/pet/service-factory.ts
