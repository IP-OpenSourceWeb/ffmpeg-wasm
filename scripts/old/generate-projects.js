import { packagesPath } from '../../env.packages.constants.js';
import { walkPathRecursive, rename, writeFile } from '../fs.functions.js';
const src = process.argv?.find((arg) => arg.startsWith('--src='))?.split('=')?.[1];

const toRemoveFromPath = [`${packagesPath}/`, `./${packagesPath}/`, './'];

if (!src) {
  console.error('Please provide both --src="..." argument');
  process.exit(1);
}

walkPathRecursive(src, (completePath, currentPath, path) => {
  generateFiles(completePath, currentPath, path);
});

/**
 * @param {string} completePath - Complete path including file name
 * @param {string} currentPath - The path to the file
 * @param {string} fileName - The name of the file
 */
function generateFiles(completePath, currentPath, fileName) {
  if (currentPath === `./${ffmpegPath}`) {
    console.log(completePath);
    generateMainNxProjectJson(currentPath);
  }
  //  else if (fileName === 'Makefile') {
  //   console.log(completePath);
  //   rename(completePath, `${completePath}_Original`);
  //   generateMakefile(completePath);
  //   generateNxProjectJson(currentPath);
  // }
}

/**
 * @param {string} filePath - The path to the file
 * @param {string} fileName - The name of the file
 */
function cleanup(filePath, fileName) {}

/**
 * @param {string} completePath - Complete path to file including file name
 */
function generateMakefile(completePath) {
  const prefixlessPath = removePathPrefix(completePath);

  const makefileTemplate = `
run-nx-command:
    echo "Running nx command ${prefixlessPath}:emmake"
    npx nx run ${prefixlessPath}:emmake
        `;
  writeFile(`${completePath}`, makefileTemplate);
}

/**
 * @param {string} currentPath - The path to the file
 */
function generateNxProjectJson(currentPath) {
  const prefixlessPath = removePathPrefix(currentPath);
  const nxProjectJson = {
    name: `${prefixlessPath}`,
    projectType: 'library',
    sourceRoot: `packages/${prefixlessPath}`,
    tags: [],
    targets: {
      emmake: {
        executor: 'nx:run-commands',
        options: {
          commands: ['emmake make --file=Makefile_Original -j4'],
          parallel: false,
          cwd: `packages/${prefixlessPath}`,
          color: true,
        },
      },
    },
  };

  writeFile(`${currentPath}/project.json`, JSON.stringify(nxProjectJson, null, 2));
}

function generateMainNxProjectJson(currentPath) {
  writeFile(`${currentPath}/project.json`, JSON.stringify(ffmpegProjectJson, null, 2));
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
          'emconfigure ./configure --disable-x86asm --disable-stripping',
          // "emconfigure ./configure --target-os=none --arch=x86_32 --enable-cross-compile --disable-x86asm --disable-inline-asm --disable-stripping --disable-programs --disable-doc --extra-cflags='-s USE_PTHREADS' --extra-cxxflags='-s USE_PTHREADS' --extra-ldflags='-s USE_PTHREADS -s INITIAL_MEMORY=33554432' --nm='llvm-nm' --ar=emar --ranlib=emranlib --cc=emcc --cxx=em++ --objcc=emcc --dep-cc=emcc",
          'emmake make ',
          'emmake make install',
          // 'mkdir -p wasm/dist',
          // 'emcc -I. -I./fftools -Llibavcodec -Llibavdevice -Llibavfilter -Llibavformat -Llibavresample -Llibavutil -Llibpostproc -Llibswscale -Llibswresample -Qunused-arguments -o wasm/dist/ffmpeg.js fftools/ffmpeg_opt.c fftools/ffmpeg_filter.c fftools/ffmpeg_hw.c fftools/cmdutils.c fftools/ffmpeg.c -lavdevice -lavfilter -lavformat -lavcodec -lswresample -lswscale -lavutil -lm -s USE_SDL=2  -s USE_PTHREADS=1  -s INITIAL_MEMORY=33554432',
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
          'make --file=Makefile_Original',
          'mkdir -p wasm/dist',
        ],
        parallel: false,
        cwd: 'packages/ffmpeg',
        color: true,
      },
    },
  },
};
