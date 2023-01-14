import { Command } from 'commander';
import { containerFactory } from '../bootstrap/container';
import { CleanDirectoriesCommand } from '../src/command';
import { createServer } from 'http';

const program = new Command();

const container = containerFactory(process.env.NODE_ENV as string);

const run = (action: (...args: Array<string>) => Promise<number> | number) => {
  return async (...args: Array<string>): Promise<void> => {
    const server = createServer((_, res) => {
      res.writeHead(200);
      res.end();
    });

    server.listen(9999);

    let exitCode = 0;

    try {
      exitCode = await action(...args);
    } catch (e) {
      console.error(e);
      exitCode = -999;
    }

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
