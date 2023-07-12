import fs from 'fs-extra';

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
