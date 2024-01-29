import type { ExecSyncOptionsWithStringEncoding } from 'child_process';
import { execSync } from 'child_process';
import { describe, expect, test } from '@jest/globals';

const consoleCommand = `NODE_ENV=jest ${process.argv[0]} -r ts-node/register bin/console.ts`;
const options: ExecSyncOptionsWithStringEncoding = { encoding: 'utf-8' };

describe('console', () => {
  test('help', () => {
    const output = execSync(consoleCommand + ' -h', options);

    expect(output).toMatchInlineSnapshot(`
      "Loading "jest" config
      Usage: console [options] [command]

      Options:
        -h, --help                          display help for command

      Commands:
        clean-directories [directoryNames]  Delete everything within a given
                                            directory.
        help [command]                      display help for command
      "
    `);
  });

  describe('clean-directories', () => {
    test('without directory', () => {
      const output = execSync(consoleCommand + ' clean-directories', options);

      expect(output).not.toMatch(/Start clean directory/);
      expect(output).not.toMatch(/var\/log/);
    });

    test('with cache,log directory', () => {
      const output = execSync(consoleCommand + ' clean-directories cache,log', options);

      expect(output).toMatch(/Start clean directory/);
      expect(output).toMatch(/var\/cache/);
      expect(output).toMatch(/var\/log/);
    });
  });
});
