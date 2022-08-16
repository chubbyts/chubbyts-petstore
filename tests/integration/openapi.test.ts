import fetch from 'cross-fetch';

test('openapi', async () => {
  const response = await fetch(`${process.env.INTEGRATION_ENDPOINT}/openapi`);

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
