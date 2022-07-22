import fetch from 'cross-fetch';

describe('delete', () => {
  test('missing accept', async () => {
    const response = await fetch(`${process.env.INTEGRATION_ENDPOINT}/api/pets/babb8c3c-788e-4bd8-aac2-d2b1a098a5c8`, {
      method: 'DELETE',
      headers: {
        accept: '',
      },
    });

    expect(response.status).toBe(406);

    expect(response.headers.get('content-type')).toBe('text/html');

    const responseData = await response.text();

    expect(responseData).toMatch(/Allowed accepts/);
  });

  test('not found', async () => {
    const response = await fetch(`${process.env.INTEGRATION_ENDPOINT}/api/pets/babb8c3c-788e-4bd8-aac2-d2b1a098a5c8`, {
      method: 'DELETE',
      headers: {
        accept: 'application/json',
      },
    });

    expect(response.status).toBe(404);

    expect(response.headers.get('content-type')).toBe('application/json');

    const responseData = await response.json();

    expect(responseData).toMatchInlineSnapshot(`
      Object {
        "_httpError": "NotFound",
        "detail": "There is no entry with id babb8c3c-788e-4bd8-aac2-d2b1a098a5c8",
        "status": 404,
        "title": "Not Found",
        "type": "https://datatracker.ietf.org/doc/html/rfc2616#section-10.4.5",
      }
    `);
  });

  test('successful', async () => {
    const createResponse = await fetch(`${process.env.INTEGRATION_ENDPOINT}/api/pets`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({ name: 'read.test' }),
    });

    expect(createResponse.status).toBe(201);

    const createResponseData = await createResponse.json();

    const response = await fetch(`${process.env.INTEGRATION_ENDPOINT}/api/pets/${createResponseData.id}`, {
      method: 'DELETE',
      headers: {
        accept: 'application/json',
      },
    });

    expect(response.status).toBe(204);
  });
});
