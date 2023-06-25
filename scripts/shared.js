import fs from 'fs-extra';
import { exec } from 'child_process';
import { promisify } from 'util';
/**
 * @param {fs.PathLike} dir
 * @param {(file:string) => void} callback
 */
export function walkFolders(dir, callback) {
  fs.readdir(dir, (err, files) => {
    files.sort().forEach((file) => {
      callback(file);
    });
  });
}

/**
 * @param {string} args
 * @returns {Promise<string|undefined>}
 */
export async function useShell(args = '') {
  try {
    const { stdout, stderr } = await promisify(exec)(args);
    console.log('stderr:', stderr);
    if (stderr) console.error(stderr);

    return stdout;
  } catch (e) {
    console.error(e); // should contain code (exit code) and signal (that caused the termination).
  }
}
