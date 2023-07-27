import { spawn } from 'child_process';
import { cwd } from 'process';
import { rmSync, existsSync, mkdirSync } from 'fs';

export const build = async (watch = false) => {
  const rootDir = cwd();

  if (!existsSync(`${rootDir}/dist`)) {
    mkdirSync(`${rootDir}/dist`, { recursive: true });
  }

  return Promise.all(
    ['bin', 'bootstrap', 'config', 'src'].map((dir) => {
      return new Promise((resolve, reject) => {
        if (existsSync(`${rootDir}/dist/${dir}`)) {
          rmSync(`${rootDir}/dist/${dir}`, { recursive: true });
        }

        const subProcess = spawn(process.argv[0], [
          'node_modules/.bin/swc',
          dir,
          '--out-dir',
          `${rootDir}/dist/${dir}`,
          ...(watch ? ['-w'] : []),
        ]);

        subProcess.stderr.on('data', (data) => {
          console.log(data.toString('utf-8'));
        });

        subProcess.on('close', (code) => {
          if (code !== 0) {
            reject();
          }

          resolve();
        });

        process.on('SIGINT', () => {
          subProcess.kill('SIGINT');
          resolve();
        });
      });
    }),
  );
};
