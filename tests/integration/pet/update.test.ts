import fetch from 'cross-fetch';

describe('update', () => {
  test('missing accept', async () => {
    const response = await fetch(`${process.env.INTEGRATION_ENDPOINT}/api/pets/babb8c3c-788e-4bd8-aac2-d2b1a098a5c8`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        accept: '',
      },
      body: JSON.stringify({}),
    });

    expect(response.status).toBe(406);

    expect(response.headers.get('content-type')).toBe('text/html');

    const responseData = await response.text();

    expect(responseData).toMatch(/Allowed accepts/);
  });

  test('missing content-type', async () => {
    const response = await fetch(`${process.env.INTEGRATION_ENDPOINT}/api/pets/babb8c3c-788e-4bd8-aac2-d2b1a098a5c8`, {
      method: 'PUT',
      headers: {
        accept: 'application/json',
      },
      body: JSON.stringify({}),
    });

    expect(response.status).toBe(415);

    expect(response.headers.get('content-type')).toBe('application/json');

    const responseData = await response.json();

    expect(responseData).toMatchInlineSnapshot(`
      Object {
        "_httpError": "UnsupportedMediaType",
        "detail": "Allowed content-types: \\"application/json\\", \\"application/jsonx+xml\\", \\"application/x-www-form-urlencoded\\", \\"application/x-yaml\\"",
        "status": 415,
        "supportedValues": Array [
          "application/json",
          "application/jsonx+xml",
          "application/x-www-form-urlencoded",
          "application/x-yaml",
        ],
        "title": "Unsupported Media Type",
        "type": "https://datatracker.ietf.org/doc/html/rfc2616#section-10.4.16",
      }
    `);
  });

  test('not found', async () => {
    const response = await fetch(`${process.env.INTEGRATION_ENDPOINT}/api/pets/babb8c3c-788e-4bd8-aac2-d2b1a098a5c8`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({}),
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

  test('validation error', async () => {
    const createResponse = await fetch(`${process.env.INTEGRATION_ENDPOINT}/api/pets`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({ name: 'update.test' }),
    });

    expect(createResponse.status).toBe(201);

    const createResponseData = await createResponse.json();

    const response = await fetch(`${process.env.INTEGRATION_ENDPOINT}/api/pets/${createResponseData.id}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({}),
    });

    expect(response.status).toBe(400);

    expect(response.headers.get('content-type')).toBe('application/json');

    const responseData = await response.json();

    expect(responseData).toMatchInlineSnapshot(`
      Object {
        "_httpError": "BadRequest",
        "invalidParameters": Array [
          Object {
            "context": Object {
              "code": "invalid_type",
              "expected": "string",
              "received": "undefined",
            },
            "name": "name",
            "reason": "Required",
          },
        ],
        "status": 400,
        "title": "Bad Request",
        "type": "https://datatracker.ietf.org/doc/html/rfc2616#section-10.4.1",
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
      body: JSON.stringify({ name: 'update.test' }),
    });

    expect(createResponse.status).toBe(201);

    const createResponseData = await createResponse.json();

    const response = await fetch(`${process.env.INTEGRATION_ENDPOINT}/api/pets/${createResponseData.id}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        id: createResponseData.id,
        createdAt: createResponseData.createdAt,
        updatedAt: createResponseData.updatedAt,
        name: 'update.test',
        tag: 'tag',
        vaccinations: [{ name: 'vaccination1' }, { name: 'vaccination2' }],
        _links: {
          read: {
            href: '/api/pets',
            templated: false,
            rel: [],
            attributes: {
              method: 'GET',
            },
          },
        },
      }),
    });

    expect(response.status).toBe(200);

    expect(response.headers.get('content-type')).toBe('application/json');

    const responseData = await response.json();

    expect(responseData).toEqual({
      id: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      name: 'update.test',
      tag: 'tag',
      vaccinations: [{ name: 'vaccination1' }, { name: 'vaccination2' }],
      _links: {
        read: {
          href: expect.stringMatching(/^\/api\/pets/),
          templated: false,
          rel: [],
          attributes: {
            method: 'GET',
          },
        },
        update: {
          href: expect.stringMatching(/^\/api\/pets/),
          templated: false,
          rel: [],
          attributes: {
            method: 'PUT',
          },
        },
        delete: {
          href: expect.stringMatching(/^\/api\/pets/),
          templated: false,
          rel: [],
          attributes: {
            method: 'DELETE',
          },
        },
      },
    });
  });
});
