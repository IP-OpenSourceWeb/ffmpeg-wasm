import { getProjectRootPath, getToRootPath, readFile, writeFile } from './fs.functions.js';

/**
 * @returns {Promise<import('../packages/index.js').IPackage>}
 * @param {string} path
 */
export async function readEnv(path = '.') {
  return JSON.parse(await readFile(`${path}/env.json`));
}

/**
 * @param {import('../packages/index.js').IPackage} env
 * @param {string} path
 * @returns {Promise<void>}
 */
export async function writeEnv(env, path = '.') {
  return writeFile(`${path}/env.json`, JSON.stringify(env, null, 2));
}

/**
 * @return {Promise<import('../packages/index.js').INxTargets>}
 * @param {string} path
 */
export async function readCommands(path) {
  const absolutePath = `${await getToRootPath()}/${path}/commands.js`;
  console.log(absolutePath);
  return await import(absolutePath);
}

/**
 * @param {string} path
 * @param {import('../packages/index.js').INxTargets} commands
 * @returns {Promise<void>}
 */
export function writeCommands(path, commands = {}) {
  const template = `
/** @type {import('..').INxTargets}*/
const commands = ${JSON.stringify(commands, null, 2)};
export default commands;
`;

  return writeFile(`${path}/commands.js`, template);
}

/**
 * @param {string} path
 * @param {import('../packages/index.js').INxProject} data
 * @returns {Promise<void>}
 */
export function writeProjectJson(path, data) {
  return writeFile(`${path}/project.json`, JSON.stringify(data, null, 2));
}
