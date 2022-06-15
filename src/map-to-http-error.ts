import { MapToHttpError } from '@chubbyts/chubbyts-api/dist/middleware/error-middleware';
import { DecodeError } from '@chubbyts/chubbyts-decode-encode/dist/decoder';
import { createBadRequest, HttpError } from '@chubbyts/chubbyts-http-error/dist/http-error';

export const mapToHttpError: MapToHttpError = (e: unknown): HttpError => {
  if (e instanceof DecodeError) {
    return createBadRequest({ detail: 'Cannot decode string' });
  }

  throw e;
};
