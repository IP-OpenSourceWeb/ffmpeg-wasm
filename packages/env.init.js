import { packages, packagesPath } from './packages.constants.js';
import { readCommands, writeCommands, writeEnv } from '../scripts/env.functions.js';

packages.forEach(async (p) => {
  const path = `${packagesPath}/${p.name}`;
  // writeEnv(p, path);

  console.log(await readCommands(path));
  try {
  } catch (e) {
    // writeCommands({}, path);
  }
});
