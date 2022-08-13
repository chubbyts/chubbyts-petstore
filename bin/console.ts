import { Command } from 'commander';
import { containerFactory } from '../bootstrap/container';
import { CleanDirectoriesCommand } from '../src/command';

const program = new Command();

const container = containerFactory(process.env.NODE_ENV as string);

program
  .command('clean-directories')
  .argument('[directoryNames]')
  .description('Delete everything within a given directory.')
  .action((directoryNamesAsString: string) => {
    container.get<CleanDirectoriesCommand>('cleanDirectoriesCommand')(
      directoryNamesAsString.split(',').map((directoryName) => directoryName.trim()),
    );
  });

program.parse(process.argv);
