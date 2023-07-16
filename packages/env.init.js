import { packages, packagesPath } from './packages.constants.js';
import { readCommands, writeCommands, writeEnv, writeProjectJson } from '../scripts/env.functions.js';
import { generateNxProjectJson } from './packages.functions.js';

packages.forEach(async (p) => {
  const path = `${packagesPath}/${p.name}`;
  writeEnv(p, path);

  try {
    const commands = await readCommands(path);
    const jsonData = generateNxProjectJson(p.name, commands);
    writeProjectJson(path, jsonData);
  } catch (e) {
    writeCommands(path);
  }
});
