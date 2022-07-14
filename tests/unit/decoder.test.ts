import { describe, expect, test } from '@jest/globals';
import { createModelDecoder } from '../../src/decoder';
import { Decoder } from '@chubbyts/chubbyts-decode-encode/dist/decoder';
import { Data } from '@chubbyts/chubbyts-decode-encode/dist';

describe('decoder', () => {
  describe('createModelDecoder', () => {
    test('without model', () => {
      const encodedData = JSON.stringify(null);
      const contentType = 'application/json';
      const context = { key: 'value' };

      const decode: Decoder['decode'] = jest.fn(
        (givenEncodedData: string, givenContentType: string, givenContext?: Record<string, unknown>): Data => {
          expect(givenEncodedData).toBe(encodedData);
          expect(givenContentType).toBe(contentType);
          expect(givenContext).toBe(context);

          return JSON.parse(givenEncodedData) as Data;
        },
      );

      const contentTypes = ['application/json'];

      const defaultDecoder: Decoder = {
        decode,
        contentTypes,
      };

      const modelDecoder = createModelDecoder(defaultDecoder);

      expect(modelDecoder.decode(encodedData, contentType, context)).toMatchInlineSnapshot(`null`);

      expect(modelDecoder.contentTypes).toBe(contentTypes);

      expect(decode).toHaveBeenCalledTimes(1);
    });

    test('with model', () => {
      const encodedData = JSON.stringify({
        id: '6a1e5d32-1c20-4893-9953-5e066814d5af',
        createdAt: new Date('2022-01-01').toJSON(),
        updatedAt: new Date('2022-01-02').toJSON(),
        name: 'Name',
        _links: {
          read: {
            href: '/api/pets/6a1e5d32-1c20-4893-9953-5e066814d5af',
            templated: false,
            rel: [],
            attributes: {
              method: 'GET',
            },
          },
        },
      });
      const contentType = 'application/json';
      const context = { key: 'value' };

      const decode: Decoder['decode'] = jest.fn(
        (givenEncodedData: string, givenContentType: string, givenContext?: Record<string, unknown>): Data => {
          expect(givenEncodedData).toBe(encodedData);
          expect(givenContentType).toBe(contentType);
          expect(givenContext).toBe(context);

          return JSON.parse(givenEncodedData) as Data;
        },
      );

      const contentTypes = ['application/json'];

      const defaultDecoder: Decoder = {
        decode,
        contentTypes,
      };

      const modelDecoder = createModelDecoder(defaultDecoder);

      expect(modelDecoder.decode(encodedData, contentType, context)).toMatchInlineSnapshot(`
        Object {
          "name": "Name",
        }
      `);

      expect(modelDecoder.contentTypes).toBe(contentTypes);

      expect(decode).toHaveBeenCalledTimes(1);
    });
  });
});
