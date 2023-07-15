import fs from 'fs-extra';
import { dirname } from 'path';

import * as url from 'url';
export const __filename = toStandardPath(url.fileURLToPath(import.meta.url));
export const __dirname = toStandardPath(url.fileURLToPath(new URL('.', import.meta.url)));

/**
 * @param {fs.PathLike} dir
 * @param {(completePath:string, currentPath:string, fileName:string) => void} callback
 */

export async function walkPathRecursive(dir, callback) {
  const files = await fs.readdir(dir);
  files.sort().forEach(async (fileName) => {
    const completePath = `${dir}/${fileName}`;

    if (await isDirectory(completePath)) {
      walkPathRecursive(completePath, callback);
    } else {
      callback(completePath, `${dir}`, fileName);
    }
  });
}

/**
 * @param {fs.PathLike} oldPath
 * @param {fs.PathLike} newPath
 * @returns {Promise<void | undefined>}
 */
export async function rename(oldPath, newPath) {
  try {
    return await fs.rename(oldPath, newPath);
  } catch (err) {
    console.error(err);
  }
}

/**
 * @param {fs.PathLike} path
 */
export async function isDirectory(path) {
  return (await fs.lstat(path)).isDirectory();
}

/**
 * @param {fs.PathOrFileDescriptor} filePath
 * @param {string | NodeJS.ArrayBufferView} data
 */
export async function writeFile(filePath, data) {
  return fs.writeFile(filePath, data);
}

/**
 * @param {fs.PathOrFileDescriptor} filePath
 * @returns {Promise<string>}
 */
export async function readFile(filePath) {
  return fs.readFile(filePath, 'utf8');
}

export async function getProjectRootPath(path = __dirname) {
  console.log(path);

  const files = await fs.readdir(path);
  if (files.includes('package.json')) {
    return path;
  } else return getProjectRootPath(path.split('/').slice(0, -1).join('/'));
}

export async function getToRootPath(path = __dirname) {
  const rootPath = (await getProjectRootPath(path)) + '/';
  const relativePath = path.split(rootPath)[1];

  console.log(relativePath);
  const numberOfBackSteps = relativePath.split('/').length - 1;

  if (numberOfBackSteps === 0) return './';
  else return Array(numberOfBackSteps).fill('..').join('/');
}

/**
 * @param {string} path
 */
export function toStandardPath(path) {
  if (path.includes('/')) return path;
  else return path.split('\\').join('/');
}
