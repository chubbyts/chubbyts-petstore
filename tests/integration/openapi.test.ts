import fetch from 'cross-fetch';
import { expect, test } from 'vitest';

test('openapi', async () => {
  const response = await fetch(`${process.env.HTTP_URI}/openapi`);

  expect(response.status).toBe(200);
  expect(response.headers.get('content-type')).toBe('application/json');

  const responseData = await response.json();

  expect(responseData).toMatchObject({
    paths: {
      '/api/pets': {
        get: {},
        post: {},
      },
      '/api/pets/{id}': {
        get: {},
        put: {},
        delete: {},
      },
    },
  });
});
