import { Command } from 'commander';
import container from '../bootstrap/container';
import { CleanDirectoriesCommand } from '../src/command';

const program = new Command();

program
  .command('clean-directories')
  .argument('[directoryNames]')
  .description('Delete everything within a given directory.')
  .action((directoryNamesAsString: string) => {
    container(process.env.NODE_ENV as string).get<CleanDirectoriesCommand>('cleanDirectoriesCommand')(
      directoryNamesAsString.split(',').map((directoryName) => directoryName.trim()),
    );
  });

program.parse(process.argv);
