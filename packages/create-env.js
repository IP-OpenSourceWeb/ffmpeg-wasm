import { packages, packagesPath } from './constants';
import { writeEnv } from '../scripts/src/project.functions';

packages.forEach((p) => {
  writeEnv(p, packagesPath);
});
