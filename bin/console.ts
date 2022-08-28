import { Command } from 'commander';
import { containerFactory } from '../bootstrap/container';
import { CleanDirectoriesCommand } from '../src/command';

const container = containerFactory(process.env.NODE_ENV as string);

const program = new Command();

const run = (action: Function) => {
  return async (...args: Array<unknown>): Promise<void> => {
    try {
      process.exit(await action(...args));
    } catch (e) {
      console.error(e);
      process.exit(-999);
    }
  };
};

(async () => {
  program
    .command('clean-directories')
    .argument('[directoryNames]')
    .description('clean the given directories by names as commaseperated values.')
    .action(
      run((directoryNamesAsString: string): number => {
        const directoryNames = directoryNamesAsString
          ? directoryNamesAsString.split(',').map((directoryName) => directoryName.trim())
          : [];
        const command = container.get<CleanDirectoriesCommand>('cleanDirectoriesCommand');
        return command(directoryNames);
      }),
    );

  await program.parseAsync(process.argv);
})();
