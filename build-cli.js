const build = require('./build');

(async () => {
  const [_node, _script, ...args] = process.argv;

  await build(args[0] === '-w');
})();
