import { lstatSync, renameSync, writeFileSync } from 'fs-extra';
import { walkFolders } from './shared.js';
import { ffmpegPath } from './vars.js';
const src = process.argv?.find((arg) => arg.startsWith('--src='))?.split('=')?.[1];

const toRemoveFromPath = ['packages/', './packages/', './'];

if (!src) {
  console.error('Please provide both --src="..." argument');
  process.exit(1);
}

walkFolders(src, (file) => {
  generateFiles(src, file);
});

/**
 * @param {string} filePath - The path to the file
 * @param {string} fileName - The name of the file
 */
function generateFiles(filePath, fileName) {
  const completeFilePath = `${filePath}/${fileName}`;

  if (fileName === 'Makefile' && !lstatSync(completeFilePath).isDirectory()) {
    console.log(completeFilePath);
    renameMakefile(completeFilePath);
    generateMakefile(filePath, completeFilePath);
    generateNxProjectJson(filePath);
  } else {
    if (lstatSync(completeFilePath).isDirectory()) {
      walkFolders(completeFilePath, (file) => {
        generateFiles(completeFilePath, file);
      });
    }
  }
}

/**
 * @param {string} filePath - The path to the file
 * @param {string} fileName - The name of the file
 */
function cleanup(filePath, fileName) {}

/**
 * @param {string} completeFilePath
 */
function renameMakefile(completeFilePath) {
  renameSync(`${completeFilePath}`, `${completeFilePath}_Original`);
}

/**
 * @param {string} completeFilePath
 */
function revertMakefile(completeFilePath) {
  renameSync(`${completeFilePath}_Original`, `${completeFilePath}`);
}

/**
 * @param {string} filePath - The path to the file
 * @param {string} completeFilePath - Complete path to file including file name
 */
function generateMakefile(filePath, completeFilePath) {
  const prefixlessPath = removePathPrefix(filePath);

  const makefileTemplate = `
run-nx-command:
    npx nx run ${prefixlessPath}:emmake
        `;
  writeFileSync(`${completeFilePath}`, makefileTemplate);
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
      emmake: {
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

  const projectData = filePath === ffmpegPath ? ffmpegProjectJson : nxProjectJson;

  writeFileSync(`${filePath}/project.json`, JSON.stringify(projectData, null, 2));
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

const ffmpegProjectJson = {
  name: 'ffmpeg',
  projectType: 'library',
  sourceRoot: 'packages/ffmpeg',
  tags: [],
  targets: {
    emmake: {
      executor: 'nx:run-commands',
      options: {
        commands: [
          "emconfigure ./configure --target-os=none --arch=x86_32 --enable-cross-compile --disable-x86asm --disable-inline-asm --disable-stripping --disable-programs --disable-doc --extra-cflags='-s USE_PTHREADS' --extra-cxxflags='-s USE_PTHREADS' --extra-ldflags='-s USE_PTHREADS -s INITIAL_MEMORY=33554432' --nm='llvm-nm' --ar=emar --ranlib=emranlib --cc=emcc --cxx=em++ --objcc=emcc --dep-cc=emcc",
          'emmake make -f=Makefile_Original -j4',
          'mkdir -p wasm/dist',
          'emcc -I. -I./fftools -Llibavcodec -Llibavdevice -Llibavfilter -Llibavformat -Llibavresample -Llibavutil -Llibpostproc -Llibswscale -Llibswresample -Qunused-arguments -o wasm/dist/ffmpeg.js fftools/ffmpeg_opt.c fftools/ffmpeg_filter.c fftools/ffmpeg_hw.c fftools/cmdutils.c fftools/ffmpeg.c -lavdevice -lavfilter -lavformat -lavcodec -lswresample -lswscale -lavutil -lm -s USE_SDL=2  -s USE_PTHREADS=1  -s INITIAL_MEMORY=33554432',
        ],
        parallel: false,
        cwd: 'packages/ffmpeg',
        color: true,
      },
    },
    make: {
      executor: 'nx:run-commands',
      options: {
        commands: [
          './configure --target-os=none --arch=x86_32 --enable-cross-compile --disable-x86asm --disable-inline-asm --disable-stripping --disable-programs --disable-doc',
          'make -f=Makefile_Original',
          'mkdir -p wasm/dist',
        ],
        parallel: false,
        cwd: 'packages/ffmpeg',
        color: true,
      },
    },
  },
};
