import { Command } from 'commander';
import container from '../bootstrap/container';
import { CleanDirectoriesCommand } from '../src/command';

const program = new Command();

program
  .command('clean-directories')
  .argument('<string>', 'directoryNames')
  .description('Delete everything within a given directory.')
  .option('-e, --env [env]', 'Environment', 'dev')
  .action((directoryNamesAsString: string, options: { env: string }) => {
    container(options.env).get<CleanDirectoriesCommand>('cleanDirectoriesCommand')(
      directoryNamesAsString.split(',').map((directoryName) => directoryName.trim()),
    );
  });

program.parse(process.argv);
