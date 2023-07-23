import { getToRootPath, readFile, writeFile } from './fs.functions.js';

/**
 * @returns {Promise<import('../env.js').IPackage>}
 * @param {string} path
 */
export async function readEnv(path = '.') {
  return JSON.parse(await readFile(`${path}/env.json`));
}

/**
 * @param {import('../env.js').IPackage} env
 * @param {string} path
 * @returns {Promise<void>}
 */
export async function writeEnv(env, path = '.') {
  return writeFile(`${path}/env.json`, JSON.stringify(env, null, 2));
}

/**
 * @param {string} path
 * @return {Promise<{commandsFn:import('../env.js').ICommandsModule['commandsFn'], error?:any} | {commandsFn?:import('../env.js').ICommandsModule['commandsFn'], error: any}>}
 */
export async function readCommands(path) {
  try {
    const absolutePath = `${await getToRootPath()}/${path}/commands.js`;
    return { commandsFn: (await import(absolutePath)).default.commandsFn };
  } catch (e) {
    return {
      error: await e,
    };
  }
}

/**
 * @param {string} path
 * @param {import('../env.js').INxTargets} commands
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
 * @param {import('../env.js').INxProject} data
 * @returns {Promise<void>}
 */
export function writeProjectJson(path, data) {
  return writeFile(`${path}/project.json`, JSON.stringify(data, null, 2));
}
