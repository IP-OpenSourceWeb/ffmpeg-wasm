import { exec } from 'child_process';
import { promisify } from 'util';

/**
 * @param {string} args
 * @returns {Promise<string|undefined>}
 */
export async function useShell(args = '') {
  try {
    const { stdout, stderr } = await promisify(exec)(args);
    console.log(args);
    if (stderr) console.error(stderr);

    return stdout;
  } catch (err) {
    console.error(err);
  }
}

/**
 * @param {string} args
 * @param {string} token - The token used to be replaced with the current working directory
 * @returns {Promise<string|undefined>}
 */
export async function useShellWithCurrentPath(args = '', token = `$PWD`) {
  return useShell(args.replace(token, getCurrentProcessPath()));
}

export function getCurrentProcessPath() {
  return process.cwd();
}

/**
 *
 * @param {string} replaceToken - The token from which to start replacing the path
 * @param {string} path - The path to be appended to the current working directory
 * @returns {string}
 */
export function reduceProcessPathTo(replaceToken, path) {
  return getCurrentProcessPath().split(replaceToken)[0] + path;
}
