import fetch from 'cross-fetch';

describe('list', () => {
  test('missing accept', async () => {
    const response = await fetch(`${process.env.INTEGRATION_ENDPOINT}/api/pets`, {
      method: 'GET',
      headers: {
        accept: '',
      },
    });

    expect(response.status).toBe(406);

    expect(response.headers.get('content-type')).toBe('text/html');

    const responseData = await response.text();

    expect(responseData).toMatch(/Allowed accepts/);
  });

  test('validation error', async () => {
    const response = await fetch(`${process.env.INTEGRATION_ENDPOINT}/api/pets?filters[name1]=list.test`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    });

    expect(response.status).toBe(400);

    expect(response.headers.get('content-type')).toBe('application/json');

    const responseData = await response.json();

    expect(responseData).toMatchInlineSnapshot(`
      {
        "_httpError": "BadRequest",
        "invalidParameters": [
          {
            "context": {
              "code": "unrecognized_keys",
              "keys": [
                "name1",
              ],
            },
            "name": "filters",
            "reason": "Unrecognized key(s) in object: 'name1'",
          },
        ],
        "status": 400,
        "title": "Bad Request",
        "type": "https://datatracker.ietf.org/doc/html/rfc2616#section-10.4.1",
      }
    `);
  });

  test('successful', async () => {
    const createResponse1 = await fetch(`${process.env.INTEGRATION_ENDPOINT}/api/pets`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({ name: 'list.test' }),
    });

    expect(createResponse1.status).toBe(201);

    const createResponse2 = await fetch(`${process.env.INTEGRATION_ENDPOINT}/api/pets`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({ name: 'list.test' }),
    });

    expect(createResponse2.status).toBe(201);

    const response = await fetch(`${process.env.INTEGRATION_ENDPOINT}/api/pets?filters[name]=list.test&limit=1`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    });

    expect(response.status).toBe(200);

    expect(response.headers.get('content-type')).toBe('application/json');

    const responseData = await response.json();

    expect(responseData).toEqual({
      offset: 0,
      limit: 1,
      filters: {
        name: 'list.test',
      },
      sort: {},
      count: 2,
      items: [
        {
          id: expect.any(String),
          createdAt: expect.any(String),
          name: 'list.test',
          _links: {
            read: {
              href: expect.stringMatching(/^\/api\/pets/),
              attributes: {
                method: 'GET',
              },
            },
            update: {
              href: expect.stringMatching(/^\/api\/pets/),
              attributes: {
                method: 'PUT',
              },
            },
            delete: {
              href: expect.stringMatching(/^\/api\/pets/),
              attributes: {
                method: 'DELETE',
              },
            },
          },
        },
      ],
      _links: {
        create: {
          href: expect.stringMatching(/^\/api\/pets/),
          attributes: {
            method: 'POST',
          },
        },
      },
    });
  });
});
