import dev from './dev';
import { Config } from './prod';

export default (env: string): Config => {
  return dev(env);
};
