import { readFile, writeFile } from './fs.functions';

/** @returns {Promise<import('../../packages').IPackage>} */
export async function readEnv(path = '.') {
  return JSON.parse(await readFile(`${path}/env.json`));
}

/**
 *
 * @param {import('../../packages').IPackage} env
 * @param {string} path
 * @returns {Promise<void>}
 */
export async function writeEnv(env, path = '.') {
  return writeFile(`${path}/${env.name}/env.json`, JSON.stringify(env));
}

/** @return {Promise<import('../../packages').INxTargets>} */
export function readCommands(path = '.') {
  return import(`${path}/commands.js`);
}
