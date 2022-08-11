import development from './development';
import { Config } from './production';

export default (env: string): Config => {
  return development(env);
};
