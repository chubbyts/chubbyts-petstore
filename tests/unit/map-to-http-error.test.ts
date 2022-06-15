import { describe, expect, test } from '@jest/globals';
import { mapToHttpError } from '../../src/map-to-http-error';
import { DecodeError } from '@chubbyts/chubbyts-decode-encode/dist/decoder';

describe('mapToHttpError', () => {
  test('unknown e', async () => {
    const error = new Error('something went wrong');

    try {
      mapToHttpError(error);
      fail('Expect error');
    } catch (e) {
      expect(e).toBe(e);
    }
  });

  test('convert decode', async () => {
    const error = new DecodeError('something went wrong');

    expect(mapToHttpError(error)).toMatchInlineSnapshot(`
      Object {
        "_httpError": "BadRequest",
        "detail": "Cannot decode string",
        "status": 400,
        "title": "Bad Request",
        "type": "https://datatracker.ietf.org/doc/html/rfc2616#section-10.4.1",
      }
    `);
  });
});
