import { build } from './build.js';

(async () => {
  const [_node, _script, ...args] = process.argv;

  await build(args[0] === '-w');
})();
