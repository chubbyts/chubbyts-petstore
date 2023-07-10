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
    console.log(`command start: ${new Date().toJSON()}`);
    const exitCode = await runAction(action, args);
    console.log(`command end: ${new Date().toJSON()}, exitCode: ${exitCode}`);
    process.exit(exitCode);
  };
};

(async () => {
  program
    .command('clean-directories')
    .argument('[directoryNames]')
    .description('Delete everything within a given directory.')
    .action(
      run((directoryNamesAsString?: string): number => {
        const command = container.get<CleanDirectoriesCommand>('cleanDirectoriesCommand');
        return command(
          directoryNamesAsString ? directoryNamesAsString.split(',').map((directoryName) => directoryName.trim()) : [],
        );
      }),
    );

  await program.parseAsync(process.argv);
})();
