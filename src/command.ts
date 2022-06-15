import { rmSync, mkdirSync } from 'fs';

export type CleanDirectoriesCommand = (directoryNames: Array<string>) => number;

export const createCleanDirectoriesCommand = (directories: Map<string, string>): CleanDirectoriesCommand => {
  return (directoryNames: Array<string>): number => {
    const unsupportedDirectoryNames: Array<string> = directoryNames.filter(
      (directoryName) => !directories.has(directoryName),
    );

    if (unsupportedDirectoryNames.length > 0) {
      console.error(`Unsupported directory names: ${unsupportedDirectoryNames.join(', ')}`);

      return 1;
    }

    directoryNames.forEach((directoryName) => {
      const directory = directories.get(directoryName) as string;

      console.info(`Start clean directory with name "${directoryName}" at path "${directory}"`);

      rmSync(directory, { recursive: true });
      mkdirSync(directory);
    });

    return 0;
  };
};
