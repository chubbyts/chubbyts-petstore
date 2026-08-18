/* oxlint-disable functional/no-let */

import { readFileSync } from 'fs';
import fetch from 'cross-fetch';

type Realm = {
  clients: Array<{ clientId: string; secret?: string }>;
  users: Array<{ username: string; credentials: Array<{ type: string; value: string }> }>;
};

const clientId = 'petstore';
const username = 'petstore';

const realm: Realm = JSON.parse(
  readFileSync(new URL('../../docker/development/keycloak/import/petstore-realm.json', import.meta.url), 'utf8'),
);

const resolveClientSecret = (): string => {
  const secret = realm.clients.find((client) => client.clientId === clientId)?.secret;

  if (!secret) {
    throw new Error(`Missing secret for client "${clientId}" in realm import`);
  }

  return secret;
};

const resolvePassword = (): string => {
  const password = realm.users
    .find((user) => user.username === username)
    ?.credentials.find((credential) => credential.type === 'password')?.value;

  if (!password) {
    throw new Error(`Missing password for user "${username}" in realm import`);
  }

  return password;
};

let authorization: string | undefined;

export const getAuthorizationHeader = async (): Promise<{ authorization: string }> => {
  if (!authorization) {
    const configurationResponse = await fetch(`${process.env.OIDC_ISSUER}/.well-known/openid-configuration`);
    const { token_endpoint: tokenEndpoint } = await configurationResponse.json();

    const tokenResponse = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'password',
        client_id: clientId,
        client_secret: resolveClientSecret(),
        username,
        password: resolvePassword(),
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error(
        `Cannot request access token: status ${tokenResponse.status}, body ${await tokenResponse.text()}`,
      );
    }

    const { access_token: accessToken } = await tokenResponse.json();

    authorization = `Bearer ${accessToken}`;
  }

  return { authorization };
};
