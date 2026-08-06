# chubbyts-petstore

[![CI](https://github.com/chubbyts/chubbyts-petstore/actions/workflows/ci.yml/badge.svg?branch=mongo)](https://github.com/chubbyts/chubbyts-petstore/actions/workflows/ci.yml)
[![Coverage Status](https://coveralls.io/repos/github/chubbyts/chubbyts-petstore/badge.svg?branch=master)](https://coveralls.io/github/chubbyts/chubbyts-petstore?branch=master)
[![Mutation testing badge](https://img.shields.io/endpoint?style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fchubbyts%2Fchubbyts-petstore%2Fmaster)](https://dashboard.stryker-mutator.io/reports/github.com/chubbyts/chubbyts-petstore/master)

[![bugs](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-petstore&metric=bugs&branch=mongo)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-petstore&branch=mongo)
[![code_smells](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-petstore&metric=code_smells&branch=mongo)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-petstore&branch=mongo)
[![coverage](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-petstore&metric=coverage&branch=mongo)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-petstore&branch=mongo)
[![duplicated_lines_density](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-petstore&metric=duplicated_lines_density&branch=mongo)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-petstore&branch=mongo)
[![ncloc](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-petstore&metric=ncloc&branch=mongo)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-petstore&branch=mongo)
[![sqale_rating](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-petstore&metric=sqale_rating&branch=mongo)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-petstore&branch=mongo)
[![alert_status](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-petstore&metric=alert_status&branch=mongo)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-petstore&branch=mongo)
[![reliability_rating](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-petstore&metric=reliability_rating&branch=mongo)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-petstore&branch=mongo)
[![security_rating](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-petstore&metric=security_rating&branch=mongo)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-petstore&branch=mongo)
[![sqale_index](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-petstore&metric=sqale_index&branch=mongo)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-petstore&branch=mongo)
[![vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-petstore&metric=vulnerabilities&branch=mongo)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-petstore&branch=mongo)

## Description

An api skeleton using mongodb for [chubbyts-framework][6].

## Requirements

 * node: 22
 * [@asteasolutions/zod-to-openapi][1]: ^9.1.0
 * [@chubbyts/chubbyts-decode-encode][2]: ^2.4.1
 * [@chubbyts/chubbyts-dic][3]: ^2.3.0
 * [@chubbyts/chubbyts-dic-config][4]: ^2.3.0
 * [@chubbyts/chubbyts-dic-types][5]: ^2.3.0
 * [@chubbyts/chubbyts-framework][6]: ^3.2.2
 * [@chubbyts/chubbyts-framework-router-path-to-regexp][7]: ^3.2.1
 * [@chubbyts/chubbyts-http-error][8]: ^3.4.1
 * [@chubbyts/chubbyts-log-types][9]: ^3.3.0
 * [@chubbyts/chubbyts-mongodb][10]: ^2.3.0
 * [@chubbyts/chubbyts-negotiation][11]: ^4.4.0
 * [@chubbyts/chubbyts-pino-adapter][12]: ^3.3.0
 * [@chubbyts/chubbyts-undici-api][13]: ^2.1.0
 * [@chubbyts/chubbyts-undici-cors][14]: ^1.3.0
 * [@chubbyts/chubbyts-undici-server][15]: ^1.2.0
 * [@chubbyts/chubbyts-undici-server-node][16]: ^1.2.0
 * [commander][17]: ^15.0.0
 * [mongodb][18]: ^7.5.0
 * [openapi3-ts][19]: ^4.6.1
 * [pino][20]: ^10.3.1
 * [uuid][21]: ^14.0.1
 * [zod][21]: ^4.4.3

## Environment

Add the following environment variable to your system, for example within `~/.bashrc` or  `~/.zshrc`:

```sh
export USER_ID=$(id -u)
export GROUP_ID=$(id -g)
```

### Mount points

#### bash

```sh
touch ~/.bash_docker
touch ~/.bash_history
```

#### zsh

```sh
touch ~/.zsh_docker
touch ~/.zsh_history
```

#### git

```sh
touch ~/.gitconfig
touch ~/.gitignore
```

#### npm

```sh
touch ~/.npmrc
```

#### Coding agents

##### Claude

```sh
if [ ! -f ~/.claude.json ]; then
    cat > ~/.claude.json <<'EOF'
{}
EOF
fi

mkdir -p ~/.claude

if [ ! -f ~/.claude/.credentials.json ]; then
    cat > ~/.claude/.credentials.json <<'EOF'
{}
EOF
fi

if [ ! -f ~/.claude/settings.json ]; then
    cat > ~/.claude/settings.json <<'EOF'
{
    "fileCheckpointingEnabled": false,
    "permissions": {
        "defaultMode": "bypassPermissions"
    },
    "skipDangerousModePermissionPrompt": true,
    "spinnerTipsEnabled": false,
    "switchModelsOnFlag": false,
    "theme": "auto"
}
EOF
fi

chmod 600 \
    ~/.claude/.credentials.json \
    ~/.claude/settings.json
```

##### Codex

```sh
mkdir -p ~/.codex

if [ ! -f ~/.codex/auth.json ]; then
    cat > ~/.codex/auth.json <<'EOF'
{}
EOF
fi

if [ ! -f ~/.codex/config.toml ]; then
    cat > ~/.codex/config.toml <<'EOF'
approval_policy = "never"
sandbox_mode = "danger-full-access"

[notice]
hide_full_access_warning = true
EOF
fi

chmod 600 \
    ~/.codex/auth.json
    ~/.codex/config.toml
```

##### Opencode

```sh
mkdir -p ~/.config/opencode ~/.local/share/opencode

if [ ! -f ~/.config/opencode/opencode.jsonc ]; then
    cat > ~/.config/opencode/opencode.jsonc <<'EOF'
{
    "$schema": "https://opencode.ai/config.json",
    "permission": {
        "*": "allow"
    }
}
EOF
fi

if [ ! -f ~/.config/opencode/tui.json ]; then
    cat > ~/.config/opencode/tui.json <<'EOF'
{
    "$schema": "https://opencode.ai/tui.json",
    "theme": "system",
    "tips": false
}
EOF
fi

if [ ! -f ~/.local/share/opencode/auth.json ]; then
    printf '{}\n' > ~/.local/share/opencode/auth.json
fi

chmod 600 \
    ~/.config/opencode/opencode.jsonc \
    ~/.config/opencode/tui.json \
    ~/.local/share/opencode/auth.json
```

##### PI

```sh
mkdir -p ~/.pi/agent
[ ! -f ~/.pi/agent/auth.json ] && echo '{}' > ~/.pi/agent/auth.json
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

### Dashboard

Before you start, produce at least one error, [produce a 404](https://localhost/api/unknown).

[Create Index Pattern](http://localhost:5601/app/management/opensearch-dashboards/indexPatterns/create)

- Username: admin
- Password: t9V02zfj!NMj?LugFsOi
- Index pattern name: logstash-*
- Time field: @timestamp

[Discover](http://localhost:5601/app/data-explorer/discover)

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
[10]: https://www.npmjs.com/package/@chubbyts/chubbyts-mongodb
[11]: https://www.npmjs.com/package/@chubbyts/chubbyts-negotiation
[12]: https://www.npmjs.com/package/@chubbyts/chubbyts-pino-adapter
[13]: https://www.npmjs.com/package/@chubbyts/chubbyts-undici-api
[14]: https://www.npmjs.com/package/@chubbyts/chubbyts-undici-cors
[15]: https://www.npmjs.com/package/@chubbyts/chubbyts-undici-server
[16]: https://www.npmjs.com/package/@chubbyts/chubbyts-undici-server-node
[17]: https://www.npmjs.com/package/commander
[18]: https://www.npmjs.com/package/mongodb
[19]: https://www.npmjs.com/package/openapi3-ts
[20]: https://www.npmjs.com/package/pino
[21]: https://www.npmjs.com/package/uuid
[22]: https://www.npmjs.com/package/zod

[30]: src/command.ts
[31]: src/handler.ts
[32]: src/pet/model.ts
[33]: src/repository.ts
[34]: src/service-factory.ts
[35]: src/pet/service-factory.ts
