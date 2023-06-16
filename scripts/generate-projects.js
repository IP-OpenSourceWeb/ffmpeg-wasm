const fs = require('fs-extra');
const src = process.argv?.find((arg) => arg.startsWith('--src='))?.split('=')?.[1];

const toRemoveFromPath = ['packages/', './packages/', './'];

if (!src) {
  console.error('Please provide both --src="..." argument');
  process.exit(1);
}

walkFolders(src, (file) => {
  choseAction(src, file);
});

/**
 * @param {fs.PathLike} dir
 * @param {(file:string) => void} callback
 */
function walkFolders(dir, callback) {
  fs.readdir(dir, (err, files) => {
    files.sort().forEach((file) => {
      callback(file);
    });
  });
}

/**
 * @param {string} filePath - The path to the file
 * @param {string} fileName - The name of the file
 */
function choseAction(filePath, fileName) {
  const completeFilePath = `${filePath}/${fileName}`;
  if (fileName === 'Makefile' && !fs.lstatSync(completeFilePath).isDirectory()) {
    console.log(completeFilePath);
    renameMakefile(completeFilePath);
    generateMakefile(filePath, completeFilePath);
    generateNxProjectJson(filePath);
  } else {
    if (fs.lstatSync(completeFilePath).isDirectory()) {
      walkFolders(completeFilePath, (file) => {
        choseAction(completeFilePath, file);
      });
    }
  }
}

/**
 * @param {string} completeFilePath
 */
function renameMakefile(completeFilePath) {
  fs.renameSync(`${completeFilePath}`, `${completeFilePath}_Original`);
}

/**
 * @param {string} filePath - The path to the file
 * @param {string} completeFilePath - Complete path to file including file name
 */
function generateMakefile(filePath, completeFilePath) {
  const prefixlessPath = removePathPrefix(filePath);

  const makefileTemplate = `
run-nx-command:
    npx nx run ${prefixlessPath}:make
        `;
  fs.writeFileSync(`${completeFilePath}`, makefileTemplate);
}

/**
 * @param {string} filePath - The path to the file
 */
function generateNxProjectJson(filePath) {
  const prefixlessPath = removePathPrefix(filePath);
  const nxProjectJson = {
    name: `${prefixlessPath}`,
    projectType: 'library',
    sourceRoot: `packages/${prefixlessPath}`,
    tags: [],
    targets: {
      make: {
        executor: 'nx:run-commands',
        options: {
          commands: ['emmake make -f=Makefile_Original -j4'],
          parallel: false,
          cwd: `packages/${prefixlessPath}`,
          color: true,
        },
      },
    },
  };

  fs.writeFileSync(`${filePath}/project.json`, JSON.stringify(nxProjectJson, null, 2));
}

/**
 * @param {string} path
 */
function removePathPrefix(path) {
  toRemoveFromPath.forEach((element) => {
    path = path.replace(element, '');
  });
  return path;
}
