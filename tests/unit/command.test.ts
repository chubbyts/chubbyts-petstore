import { randomBytes } from 'crypto';
import { mkdirSync, readdirSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { describe, expect, test } from '@jest/globals';
import type { Logger } from '@chubbyts/chubbyts-log-types/dist/log';
import { createCleanDirectoriesCommand } from '../../src/command';

describe('command', () => {
  describe('createCleanDirectoriesCommand', () => {
    test('with unknown directories', () => {
      const logs: Array<unknown> = [];

      const error = jest.fn((...args: Array<unknown>) => {
        // eslint-disable-next-line functional/immutable-data
        logs.push({ name: 'error', args });
      });

      const logger = {
        error,
      } as unknown as Logger;

      const command = createCleanDirectoriesCommand(new Map(), logger);

      command(['log']);

      expect(logs).toMatchInlineSnapshot(`
        [
          {
            "args": [
              "Unsupported directory names",
              {
                "unsupportedDirectoryNames": [
                  "log",
                ],
              },
            ],
            "name": "error",
          },
        ]
      `);

      expect(error).toHaveBeenCalledTimes(1);
    });

    test('with known directories', () => {
      const logs: Array<unknown> = [];

      const info = jest.fn((...args: Array<unknown>) => {
        // eslint-disable-next-line functional/immutable-data
        logs.push({ name: 'info', args });
      });

      const logger = {
        info,
      } as unknown as Logger;

      const logDir = tmpdir() + '/' + randomBytes(8).toString('hex');

      mkdirSync(logDir + '/some/subpath/', { recursive: true });
      writeFileSync(logDir + '/some/subpath/log-file', 'log-file');

      const command = createCleanDirectoriesCommand(new Map([['log', logDir]]), logger);

      command(['log']);

      expect(readdirSync(logDir)).toEqual([]);

      expect(logs).toEqual([
        {
          name: 'info',
          args: ['Start clean directory', { directory: logDir, directoryName: 'log' }],
        },
      ]);

      expect(info).toHaveBeenCalledTimes(1);
    });
  });
});
