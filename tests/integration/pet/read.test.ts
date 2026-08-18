import fetch from 'cross-fetch';
import { describe, expect, test } from 'vitest';
import { getAuthorizationHeader } from '../auth.js';

describe('read', () => {
  test('missing accept', async () => {
    const response = await fetch(`${process.env.HTTP_URI}/api/pets/019c201f-6a83-7696-9899-50fbf7b2278d`, {
      method: 'GET',
      headers: {
        ...(await getAuthorizationHeader()),
        accept: '',
      },
    });

    expect(response.status).toBe(406);

    expect(response.headers.get('content-type')).toBe('text/html');

    const responseData = await response.text();

    expect(responseData).toMatch(/Not Acceptable/);
  });

  test('not found', async () => {
    const response = await fetch(`${process.env.HTTP_URI}/api/pets/019c201f-6a83-7696-9899-50fbf7b2278d`, {
      method: 'GET',
      headers: {
        ...(await getAuthorizationHeader()),
        accept: 'application/json',
      },
    });

    expect(response.status).toBe(404);

    expect(response.headers.get('content-type')).toBe('application/json');

    const responseData = await response.json();

    expect(responseData).toMatchInlineSnapshot(`
      {
        "_httpError": "NotFound",
        "detail": "There is no entry with id "019c201f-6a83-7696-9899-50fbf7b2278d"",
        "status": 404,
        "title": "Not Found",
        "type": "https://datatracker.ietf.org/doc/html/rfc2616#section-10.4.5",
      }
    `);
  });

  test('successful', async () => {
    const createResponse = await fetch(`${process.env.HTTP_URI}/api/pets`, {
      method: 'POST',
      headers: {
        ...(await getAuthorizationHeader()),
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({ name: 'read.test', vaccinations: [] }),
    });

    expect(createResponse.status).toBe(201);

    const createResponseData = await createResponse.json();

    const response = await fetch(`${process.env.HTTP_URI}/api/pets/${createResponseData.id}`, {
      method: 'GET',
      headers: {
        ...(await getAuthorizationHeader()),
        accept: 'application/json',
      },
    });

    expect(response.status).toBe(200);

    expect(response.headers.get('content-type')).toBe('application/json');

    const responseData = await response.json();

    expect(responseData).toEqual({
      id: expect.any(String),
      createdAt: expect.any(String),
      name: 'read.test',
      vaccinations: [],
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
    });
  });
});
