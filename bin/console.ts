import { createServer } from 'http';
import { Command } from 'commander';
import { containerFactory } from '../bootstrap/container';
import type { CleanDirectoriesCommand } from '../src/command';

const program = new Command();

const container = containerFactory(process.env.NODE_ENV as string);

type Action = (...args: Array<string>) => Promise<number> | number;

const runAction = async (action: Action, args: Array<string>): Promise<number> => {
  try {
    return await action(...args);
  } catch (e) {
    console.error(e);
    return -999;
  }
};

const run = (action: Action) => {
  return async (...args: Array<string>): Promise<void> => {
    const server = createServer((_, res) => {
      res.writeHead(200);
      res.end();
    });

    server.listen(9999);

    const exitCode = await runAction(action, args);

    setTimeout(() => {
      server.close();
      process.exit(exitCode);
    }, 1000);
  };
};

(async () => {
  program
    .command('clean-directories')
    .argument('[directoryNames]')
    .description('Delete everything within a given directory.')
    .action(
      run((directoryNamesAsString: string): number => {
        const command = container.get<CleanDirectoriesCommand>('cleanDirectoriesCommand');
        return command(directoryNamesAsString.split(',').map((directoryName) => directoryName.trim()));
      }),
    );

  await program.parseAsync(process.argv);
})();
