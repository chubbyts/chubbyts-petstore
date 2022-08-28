import { describe, expect, test } from '@jest/globals';
import { execSync, ExecSyncOptionsWithStringEncoding } from 'child_process';
const consoleCommand = `NODE_ENV=jest ${process.argv[0]} node_modules/.bin/ts-node bin/console.ts`;
const options: ExecSyncOptionsWithStringEncoding = { encoding: 'utf-8' };

describe('console', () => {
  test('help', () => {
    const output = execSync(consoleCommand + ' -h', options);

    expect(output).toMatchInlineSnapshot(`
      "Loading \\"jest\\" config
      Usage: console [options] [command]

      Options:
        -h, --help                          display help for command

      Commands:
        clean-directories [directoryNames]  clean the given directories by names as
                                            commaseperated values.
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
