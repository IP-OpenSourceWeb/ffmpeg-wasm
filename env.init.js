import { packages, packagesPath } from './env.packages.constants.js';
import { readCommands, readEnv, writeCommands, writeEnv, writeProjectJson } from './scripts/env.functions.js';
import { generateNxProjectJson } from './env.packages.functions.js';

packages.forEach(async (p) => {
  const path = `${packagesPath}/${p.name}`;
  const env = await readEnv(path);

  if (env.gitPath !== p.gitPath || env.gitUrl !== p.gitUrl || env.name !== p.name) {
    writeEnv(p, path);
  }

  const { error, commandsFn } = await readCommands(path);
  if (!error) {
    const jsonData = generateNxProjectJson(p.name, commandsFn?.(path, p.gitPath));
    writeProjectJson(path, jsonData);
  } else {
    writeCommands(path);
  }
});
