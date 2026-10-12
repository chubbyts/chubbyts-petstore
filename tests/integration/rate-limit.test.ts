import fetch from 'cross-fetch';
import { describe, expect, test } from 'vitest';
import { getAuthorizationHeader } from './auth.js';

describe('rate-limit', () => {
  test('api routes carry the rate limit headers', async () => {
    const response = await fetch(`${process.env.HTTP_URI}/api/pets`, {
      headers: {
        ...(await getAuthorizationHeader()),
        accept: 'application/json',
      },
    });

    expect(response.status).toBe(200);

    // the integration tests connect directly (no proxy), so every test shares the limit of the same client ip and the
    // remaining requests depend on the tests which ran before, the limit and reset are deterministic
    expect(response.headers.get('ratelimit-limit')).toBe('100');
    expect(response.headers.get('ratelimit-remaining')).toMatch(/^\d+$/);
    expect(response.headers.get('ratelimit-reset')).toMatch(/^\d+$/);
  });

  test('public routes are not rate limited', async () => {
    const response = await fetch(`${process.env.HTTP_URI}/ping`);

    expect(response.status).toBe(200);

    expect(response.headers.get('ratelimit-limit')).toBeNull();
    expect(response.headers.get('ratelimit-remaining')).toBeNull();
    expect(response.headers.get('ratelimit-reset')).toBeNull();
  });
});
