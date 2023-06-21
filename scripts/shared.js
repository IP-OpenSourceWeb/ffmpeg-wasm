const fs = require('fs-extra');

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
