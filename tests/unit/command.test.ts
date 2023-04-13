import { randomBytes } from 'crypto';
import { mkdirSync, readdirSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { describe, expect, test } from '@jest/globals';
import type { Logger } from '@chubbyts/chubbyts-log-types/dist/log';
import { useObjectMock } from '@chubbyts/chubbyts-function-mock/dist/object-mock';
import { createCleanDirectoriesCommand } from '../../src/command';

describe('command', () => {
  describe('createCleanDirectoriesCommand', () => {
    test('with unknown directories', () => {
      const [logger, loggerMocks] = useObjectMock<Logger>([
        {
          name: 'error',
          parameters: [
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            'Unsupported directory names',
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            {
              unsupportedDirectoryNames: ['log'],
            },
          ],
        },
      ]);

      const command = createCleanDirectoriesCommand(new Map(), logger);

      command(['log']);

      expect(loggerMocks.length).toBe(0);
    });

    test('with known directories', () => {
      const logDir = tmpdir() + '/' + randomBytes(8).toString('hex');

      mkdirSync(logDir + '/some/subpath/', { recursive: true });
      writeFileSync(logDir + '/some/subpath/log-file', 'log-file');

      const [logger, loggerMocks] = useObjectMock<Logger>([
        {
          name: 'info',
          parameters: [
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            'Start clean directory',
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            { directory: logDir, directoryName: 'log' },
          ],
        },
      ]);

      const command = createCleanDirectoriesCommand(new Map([['log', logDir]]), logger);

      command(['log']);

      expect(readdirSync(logDir)).toEqual([]);

      expect(loggerMocks.length).toBe(0);
    });
  });
});
