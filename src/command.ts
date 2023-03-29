import { rmSync, mkdirSync } from 'fs';
import type { Logger } from '@chubbyts/chubbyts-log-types/dist/log';

export type CleanDirectoriesCommand = (directoryNames: Array<string>) => number;

export const createCleanDirectoriesCommand = (
  directories: Map<string, string>,
  logger: Logger,
): CleanDirectoriesCommand => {
  return (directoryNames: Array<string>): number => {
    const unsupportedDirectoryNames: Array<string> = directoryNames.filter(
      (directoryName) => !directories.has(directoryName),
    );

    if (unsupportedDirectoryNames.length > 0) {
      logger.error('Unsupported directory names', { unsupportedDirectoryNames });

      return 1;
    }

    directoryNames.forEach((directoryName) => {
      const directory = directories.get(directoryName) as string;

      logger.info('Start clean directory', { directoryName, directory });

      rmSync(directory, { recursive: true });
      mkdirSync(directory);
    });

    return 0;
  };
};
