import fetch from 'cross-fetch';

describe('create', () => {
  test('missing accept', async () => {
    const response = await fetch('http://127.0.0.1:12345/api/pets', {
      method: 'POST',
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
    const response = await fetch('http://127.0.0.1:12345/api/pets', {
      method: 'POST',
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

  test('validation error', async () => {
    const response = await fetch('http://127.0.0.1:12345/api/pets', {
      method: 'POST',
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
        "status": 400,
        "title": "Bad Request",
        "type": "https://datatracker.ietf.org/doc/html/rfc2616#section-10.4.1",
        "validation": Array [
          Object {
            "code": "invalid_type",
            "expected": "string",
            "message": "Required",
            "path": Array [
              "name",
            ],
            "received": "undefined",
          },
        ],
      }
    `);
  });

  test('successful', async () => {
    const response = await fetch('http://127.0.0.1:12345/api/pets', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        name: 'create.test',
        tag: 'tag',
        vaccinations: [{ name: 'vaccination1' }, { name: 'vaccination2' }],
      }),
    });

    expect(response.status).toBe(201);

    expect(response.headers.get('content-type')).toBe('application/json');

    const responseData = await response.json();

    expect(responseData).toEqual({
      id: expect.any(String),
      createdAt: expect.any(String),
      name: 'create.test',
      tag: 'tag',
      vaccinations: [{ name: 'vaccination1' }, { name: 'vaccination2' }],
    });
  });
});
