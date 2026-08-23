# chubbyts-petstore

[![CI](https://github.com/chubbyts/chubbyts-petstore/workflows/CI/badge.svg?branch=master)](https://github.com/chubbyts/chubbyts-petstore/actions?query=workflow%3ACI)
[![Coverage Status](https://coveralls.io/repos/github/chubbyts/chubbyts-petstore/badge.svg?branch=master)](https://coveralls.io/github/chubbyts/chubbyts-petstore?branch=master)
[![Mutation testing badge](https://img.shields.io/endpoint?style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fchubbyts%2Fchubbyts-petstore%2Fmaster)](https://dashboard.stryker-mutator.io/reports/github.com/chubbyts/chubbyts-petstore/master)

[![bugs](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-petstore&metric=bugs&branch=postgres)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-petstore&branch=postgres)
[![code_smells](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-petstore&metric=code_smells&branch=postgres)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-petstore&branch=postgres)
[![coverage](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-petstore&metric=coverage&branch=postgres)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-petstore&branch=postgres)
[![duplicated_lines_density](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-petstore&metric=duplicated_lines_density&branch=postgres)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-petstore&branch=postgres)
[![ncloc](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-petstore&metric=ncloc&branch=postgres)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-petstore&branch=postgres)
[![sqale_rating](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-petstore&metric=sqale_rating&branch=postgres)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-petstore&branch=postgres)
[![alert_status](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-petstore&metric=alert_status&branch=postgres)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-petstore&branch=postgres)
[![reliability_rating](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-petstore&metric=reliability_rating&branch=postgres)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-petstore&branch=postgres)
[![security_rating](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-petstore&metric=security_rating&branch=postgres)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-petstore&branch=postgres)
[![sqale_index](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-petstore&metric=sqale_index&branch=postgres)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-petstore&branch=postgres)
[![vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-petstore&metric=vulnerabilities&branch=postgres)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-petstore&branch=postgres)

## Description

An api skeleton using postgres for [chubbyts-framework][6].

## Requirements

 * node: 22
 * [@asteasolutions/zod-to-openapi][1]: ^9.1.0
 * [@chubbyts/chubbyts-decode-encode][2]: ^2.5.1
 * [@chubbyts/chubbyts-dic][3]: ^2.3.0
 * [@chubbyts/chubbyts-dic-config][4]: ^2.3.0
 * [@chubbyts/chubbyts-dic-types][5]: ^2.3.0
 * [@chubbyts/chubbyts-framework][6]: ^3.2.2
 * [@chubbyts/chubbyts-framework-router-path-to-regexp][7]: ^3.2.1
 * [@chubbyts/chubbyts-http-error][8]: ^3.4.1
 * [@chubbyts/chubbyts-log-types][9]: ^3.3.0
 * [@chubbyts/chubbyts-negotiation][10]: ^4.5.1
 * [@chubbyts/chubbyts-pino-adapter][11]: ^3.3.0
 * [@chubbyts/chubbyts-undici-api][12]: ^2.1.0
 * [@chubbyts/chubbyts-undici-cors][13]: ^1.4.0
 * [@chubbyts/chubbyts-undici-oidc][23]: ^1.2.0
 * [@chubbyts/chubbyts-undici-server][14]: ^1.3.0
 * [@chubbyts/chubbyts-undici-server-node][15]: ^1.3.0
 * [commander][16]: ^15.0.0
 * [drizzle-kit][24]: ^0.31.10
 * [drizzle-orm][17]: ^0.45.2
 * [openapi3-ts][18]: ^4.6.1
 * [pg][19]: ^8.21.0
 * [pino][20]: ^10.3.1
 * [uuid][21]: ^14.0.1
 * [zod][22]: ^4.4.3

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

###### llama.cpp

```sh
llama-server \
    -hf lmstudio-community/Qwen3.6-35B-A3B-GGUF:Q4_K_M \
    -c 32768 \
    -ngl 999 \
    --flash-attn on \
    --host 0.0.0.0 \
    --port 9931
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

### Pet (oidc protected)

* GET https://localhost/api/pets?sort[name]=asc
* POST https://localhost/api/pets
* GET https://localhost/api/pets/019c201f-6a83-7696-9899-50fbf7b2278d
* PUT https://localhost/api/pets/019c201f-6a83-7696-9899-50fbf7b2278d
* DELETE https://localhost/api/pets/019c201f-6a83-7696-9899-50fbf7b2278d

## Oidc (keycloak)

All routes below `/api` are protected by [chubbyts-undici-oidc][23], only `/ping` and `/openapi` are public.
The keycloak container acts as the identity provider,
the realm `petstore` gets imported from `docker/development/keycloak/import/petstore-realm.json` on startup
(delete and recreate the keycloak container to reimport after changes) and contains two users:

* `john.doe` (password: `johndoe1234`): a regular end user, meant to log in via the browser based frontend
  (`petstore-frontend` client, see below).
* `petstore` (password: `GBanBPatEBRZ7hf7cAxKn8Ptt`): a technical user for requesting tokens via password grant
  while testing (see the curl example below).

and two clients:

* `petstore-frontend`: public client for a separate (browser based) frontend codebase, which authenticates against
  keycloak via authorization code flow + PKCE (S256) and sends the resulting access token as
  `Authorization: Bearer <token>` header to this api. The cors setup allows the `Authorization` header for
  localhost origins in development.
* `petstore` (secret: `5FbFAgTAWyVAWSQtDPqCLZzY`): confidential client for backend integrations and for requesting
  tokens via password grant while testing.

Both clients use an audience mapper, so that the access token contains `aud: petstore`, which this api requires.

Admin console: http://keycloak:8080 (admin / TCUJyCbLtLbBc4eXYYzD9ecm). Keycloak is configured with the fixed
hostname `keycloak`, so that the issuer claim is always `http://keycloak:8080/realms/petstore`; requests via
`http://localhost:8080` get redirected to that hostname. Add `127.0.0.1 keycloak` to `/etc/hosts` on the host to use
the admin console or to request tokens from the host.

Within the node container:

```sh
ACCESS_TOKEN=$(curl -s http://keycloak:8080/realms/petstore/protocol/openid-connect/token \
  -d 'grant_type=password' \
  -d 'client_id=petstore' \
  -d 'client_secret=5FbFAgTAWyVAWSQtDPqCLZzY' \
  -d 'username=petstore' \
  -d 'password=GBanBPatEBRZ7hf7cAxKn8Ptt' | sed -E 's/.*"access_token":"([^"]+)".*/\1/')

curl -H "Authorization: Bearer ${ACCESS_TOKEN}" http://localhost:1234/api/pets
```

The integration tests run against keycloak as well (no auth mocking): `vitest.integration.setup.ts` waits for the
discovery endpoint of `OIDC_ISSUER` to be reachable and `tests/integration/auth.ts` requests tokens via password
grant with the `petstore` client and user. Within the node container keycloak is reachable as `keycloak`,
in ci a keycloak container gets started and mapped to that hostname (see `.github/workflows/ci.yml`).

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
[23]: https://github.com/chubbyts/chubbyts-undici-oidc
[24]: https://www.npmjs.com/package/drizzle-kit

[30]: src/command.ts
[31]: src/handler.ts
[32]: src/pet/model.ts
[33]: src/repository.ts
[34]: src/service-factory.ts
[35]: src/pet/service-factory.ts
