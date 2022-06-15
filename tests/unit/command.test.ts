import { describe, expect, test } from '@jest/globals';
import { randomBytes } from 'crypto';
import { mkdirSync, readdirSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { createCleanDirectoriesCommand } from '../../src/command';

describe('command', () => {
  describe('createCleanDirectoriesCommand', () => {
    test('with unknown directories', async () => {
      const error: Array<string> = [];

      console.error = (message: string) => {
        error.push(message);
      };

      const command = createCleanDirectoriesCommand(new Map());

      command(['cache', 'log']);

      expect(error).toEqual(['Unsupported directory names: cache, log']);
    });

    test('with known directories', async () => {
      const info: Array<string> = [];

      console.info = (message: string) => {
        info.push(message);
      };

      const cacheDir = tmpdir() + '/' + randomBytes(8).toString('hex');

      mkdirSync(cacheDir + '/some/subpath/', { recursive: true });
      writeFileSync(cacheDir + '/some/subpath/cache-file', 'cache-file');

      const logDir = tmpdir() + '/' + randomBytes(8).toString('hex');

      mkdirSync(logDir + '/some/subpath/', { recursive: true });
      writeFileSync(logDir + '/some/subpath/log-file', 'log-file');

      const command = createCleanDirectoriesCommand(
        new Map([
          ['cache', cacheDir],
          ['log', logDir],
        ]),
      );

      command(['cache', 'log']);

      expect(readdirSync(cacheDir)).toEqual([]);
      expect(readdirSync(logDir)).toEqual([]);

      expect(info).toEqual([
        `Start clean directory with name "cache" at path "${cacheDir}"`,
        `Start clean directory with name "log" at path "${logDir}"`,
      ]);
    });
  });
});
