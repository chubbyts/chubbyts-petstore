import { Data } from '@chubbyts/chubbyts-decode-encode/dist';
import { Decoder } from '@chubbyts/chubbyts-decode-encode/dist/decoder';

export const createModelDecoder = (defaultDecoder: Decoder): Decoder => {
  return {
    decode: (encodedData: string, contentType: string, context?: Record<string, unknown>): Data => {
      const data = defaultDecoder.decode(encodedData, contentType, context);

      if (typeof data === 'object' && data !== null) {
        const { _links, ...rest } = data as {
          _links: {};
        };

        return rest as Data;
      }

      return data;
    },
    contentTypes: defaultDecoder.contentTypes,
  };
};
