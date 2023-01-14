import { describe, expect, test } from '@jest/globals';
import { execSync, ExecSyncOptionsWithStringEncoding } from 'child_process';

const consoleCommand = `NODE_ENV=jest ${process.argv[0]} dist/bin/console.js`;
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

  test('clean-directories', () => {
    const output = execSync(consoleCommand + ' clean-directories cache,log', options);

    expect(output).toMatch(/Start clean directory with name "cache" at path "[^"]+\/var\/cache"/);
    expect(output).toMatch(/Start clean directory with name "log" at path "[^"]+\/var\/log"/);
  });
});
