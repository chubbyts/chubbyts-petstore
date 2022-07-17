import { describe, expect, test } from '@jest/globals';
import { createModelEncoder, createModelListEncoder, Links } from '../../src/encoder';
import { Encoder } from '@chubbyts/chubbyts-decode-encode/dist/encoder';
import { Data } from '@chubbyts/chubbyts-decode-encode/dist';
import { GeneratePath } from '@chubbyts/chubbyts-framework/dist/router/url-generator';
import { Query } from '@chubbyts/chubbyts-http-types/dist/message';

describe('encoder', () => {
  describe('createModelEncoder', () => {
    test('without links', () => {
      const data = {
        id: '6a1e5d32-1c20-4893-9953-5e066814d5af',
        createdAt: new Date('2022-01-01').toJSON(),
        updatedAt: new Date('2022-01-02').toJSON(),
        name: 'Name',
      };

      const contentType = 'application/json';
      const context = { key: 'value' };

      const encode: Encoder['encode'] = jest.fn(
        (givenData: Data, givenContentType: string, givenContext?: Record<string, unknown>): string => {
          expect(givenData).toEqual({
            ...data,
            _links: {},
          });
          expect(givenContentType).toBe(contentType);
          expect(givenContext).toBe(context);

          return JSON.stringify(givenData);
        },
      );

      const contentTypes = ['application/json'];

      const defaultEncoder: Encoder = {
        encode,
        contentTypes,
      };

      const generatePath: GeneratePath = jest.fn();

      const links: Links = {};

      const modelEncoder = createModelEncoder(defaultEncoder, generatePath, links);

      expect(modelEncoder.encode(data, contentType, context)).toMatchInlineSnapshot(
        `"{\\"id\\":\\"6a1e5d32-1c20-4893-9953-5e066814d5af\\",\\"createdAt\\":\\"2022-01-01T00:00:00.000Z\\",\\"updatedAt\\":\\"2022-01-02T00:00:00.000Z\\",\\"name\\":\\"Name\\",\\"_links\\":{}}"`,
      );

      expect(modelEncoder.contentTypes).toBe(contentTypes);

      expect(encode).toHaveBeenCalledTimes(1);
      expect(generatePath).toHaveBeenCalledTimes(0);
    });

    test('with links', () => {
      const data = {
        id: '6a1e5d32-1c20-4893-9953-5e066814d5af',
        createdAt: new Date('2022-01-01').toJSON(),
        updatedAt: new Date('2022-01-02').toJSON(),
        name: 'Name',
      };

      const contentType = 'application/json';
      const context = { key: 'value' };

      const encode: Encoder['encode'] = jest.fn(
        (givenData: Data, givenContentType: string, givenContext?: Record<string, unknown>): string => {
          expect(givenData).toEqual({
            ...data,
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
          expect(givenContentType).toBe(contentType);
          expect(givenContext).toBe(context);

          return JSON.stringify(givenData);
        },
      );

      const contentTypes = ['application/json'];

      const defaultEncoder: Encoder = {
        encode,
        contentTypes,
      };

      const generatePath: GeneratePath = jest.fn(
        (givenName: string, givenAttributes?: Record<string, string>, givenQuery?: Query): string => {
          expect(['pet_read', 'pet_update', 'pet_delete'].includes(givenName)).toBe(true);
          expect(givenAttributes).toEqual({ id: '6a1e5d32-1c20-4893-9953-5e066814d5af' });
          expect(givenQuery).toEqual(undefined);

          return '/api/pets/6a1e5d32-1c20-4893-9953-5e066814d5af';
        },
      );

      const links: Links = {
        create: 'pet_create',
        read: 'pet_read',
        update: 'pet_update',
        delete: 'pet_delete',
      };

      const modelEncoder = createModelEncoder(defaultEncoder, generatePath, links);

      expect(modelEncoder.encode(data, contentType, context)).toMatchInlineSnapshot(
        `"{\\"id\\":\\"6a1e5d32-1c20-4893-9953-5e066814d5af\\",\\"createdAt\\":\\"2022-01-01T00:00:00.000Z\\",\\"updatedAt\\":\\"2022-01-02T00:00:00.000Z\\",\\"name\\":\\"Name\\",\\"_links\\":{\\"read\\":{\\"href\\":\\"/api/pets/6a1e5d32-1c20-4893-9953-5e066814d5af\\",\\"templated\\":false,\\"rel\\":[],\\"attributes\\":{\\"method\\":\\"GET\\"}},\\"update\\":{\\"href\\":\\"/api/pets/6a1e5d32-1c20-4893-9953-5e066814d5af\\",\\"templated\\":false,\\"rel\\":[],\\"attributes\\":{\\"method\\":\\"PUT\\"}},\\"delete\\":{\\"href\\":\\"/api/pets/6a1e5d32-1c20-4893-9953-5e066814d5af\\",\\"templated\\":false,\\"rel\\":[],\\"attributes\\":{\\"method\\":\\"DELETE\\"}}}}"`,
      );

      expect(modelEncoder.contentTypes).toBe(contentTypes);

      expect(encode).toHaveBeenCalledTimes(1);
      expect(generatePath).toHaveBeenCalledTimes(3);
    });
  });

  describe('createModelListEncoder', () => {
    test('without links', () => {
      const data = {
        items: [
          {
            id: '6a1e5d32-1c20-4893-9953-5e066814d5af',
            createdAt: new Date('2022-01-01').toJSON(),
            updatedAt: new Date('2022-01-02').toJSON(),
            name: 'Name',
          },
        ],
      };

      const contentType = 'application/json';
      const context = { key: 'value' };

      const encode: Encoder['encode'] = jest.fn(
        (givenData: Data, givenContentType: string, givenContext?: Record<string, unknown>): string => {
          expect(givenData).toEqual({
            _embedded: {
              items: [
                {
                  ...data.items[0],
                  _links: {},
                },
              ],
            },
            _links: {},
          });
          expect(givenContentType).toBe(contentType);
          expect(givenContext).toBe(context);

          return JSON.stringify(givenData);
        },
      );

      const contentTypes = ['application/json'];

      const defaultEncoder: Encoder = {
        encode,
        contentTypes,
      };

      const generatePath: GeneratePath = jest.fn();

      const links: Links = {};

      const modelEncoder = createModelListEncoder(defaultEncoder, generatePath, links);

      expect(modelEncoder.encode(data, contentType, context)).toMatchInlineSnapshot(
        `"{\\"_embedded\\":{\\"items\\":[{\\"id\\":\\"6a1e5d32-1c20-4893-9953-5e066814d5af\\",\\"createdAt\\":\\"2022-01-01T00:00:00.000Z\\",\\"updatedAt\\":\\"2022-01-02T00:00:00.000Z\\",\\"name\\":\\"Name\\",\\"_links\\":{}}]},\\"_links\\":{}}"`,
      );

      expect(modelEncoder.contentTypes).toBe(contentTypes);

      expect(encode).toHaveBeenCalledTimes(1);
      expect(generatePath).toHaveBeenCalledTimes(0);
    });

    test('with links', () => {
      const data = {
        items: [
          {
            id: '6a1e5d32-1c20-4893-9953-5e066814d5af',
            createdAt: new Date('2022-01-01').toJSON(),
            updatedAt: new Date('2022-01-02').toJSON(),
            name: 'Name',
          },
        ],
      };

      const contentType = 'application/json';
      const context = { key: 'value' };

      const encode: Encoder['encode'] = jest.fn(
        (givenData: Data, givenContentType: string, givenContext?: Record<string, unknown>): string => {
          expect(givenData).toEqual({
            _embedded: {
              items: [
                {
                  ...data.items[0],
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
                },
              ],
            },
            _links: {
              create: {
                href: '/api/pets',
                templated: false,
                rel: [],
                attributes: {
                  method: 'POST',
                },
              },
            },
          });
          expect(givenContentType).toBe(contentType);
          expect(givenContext).toBe(context);

          return JSON.stringify(givenData);
        },
      );

      const contentTypes = ['application/json'];

      const defaultEncoder: Encoder = {
        encode,
        contentTypes,
      };

      const generatePath: GeneratePath = jest.fn(
        (givenName: string, givenAttributes?: Record<string, string>, givenQuery?: Query): string => {
          expect(['pet_create', 'pet_read', 'pet_update', 'pet_delete'].includes(givenName)).toBe(true);
          expect(givenQuery).toEqual(undefined);

          if (givenAttributes) {
            expect(givenAttributes).toEqual({ id: '6a1e5d32-1c20-4893-9953-5e066814d5af' });

            return '/api/pets/6a1e5d32-1c20-4893-9953-5e066814d5af';
          }

          return '/api/pets';
        },
      );

      const links: Links = {
        create: 'pet_create',
        read: 'pet_read',
        update: 'pet_update',
        delete: 'pet_delete',
      };

      const modelEncoder = createModelListEncoder(defaultEncoder, generatePath, links);

      expect(modelEncoder.encode(data, contentType, context)).toMatchInlineSnapshot(
        `"{\\"_embedded\\":{\\"items\\":[{\\"id\\":\\"6a1e5d32-1c20-4893-9953-5e066814d5af\\",\\"createdAt\\":\\"2022-01-01T00:00:00.000Z\\",\\"updatedAt\\":\\"2022-01-02T00:00:00.000Z\\",\\"name\\":\\"Name\\",\\"_links\\":{\\"read\\":{\\"href\\":\\"/api/pets/6a1e5d32-1c20-4893-9953-5e066814d5af\\",\\"templated\\":false,\\"rel\\":[],\\"attributes\\":{\\"method\\":\\"GET\\"}},\\"update\\":{\\"href\\":\\"/api/pets/6a1e5d32-1c20-4893-9953-5e066814d5af\\",\\"templated\\":false,\\"rel\\":[],\\"attributes\\":{\\"method\\":\\"PUT\\"}},\\"delete\\":{\\"href\\":\\"/api/pets/6a1e5d32-1c20-4893-9953-5e066814d5af\\",\\"templated\\":false,\\"rel\\":[],\\"attributes\\":{\\"method\\":\\"DELETE\\"}}}}]},\\"_links\\":{\\"create\\":{\\"href\\":\\"/api/pets\\",\\"templated\\":false,\\"rel\\":[],\\"attributes\\":{\\"method\\":\\"POST\\"}}}}"`,
      );

      expect(modelEncoder.contentTypes).toBe(contentTypes);

      expect(encode).toHaveBeenCalledTimes(1);
      expect(generatePath).toHaveBeenCalledTimes(4);
    });
  });
});
