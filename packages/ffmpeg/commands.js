import { commandNames } from '../../env.packages.constants.js';

const emscriptenFlags = [];

const ffmpegFlags = [
  '--disable-x86asm',
  '--disable-stripping',

  // ,"--target-os=none ","--arch=x86_32 ","--enable-cross-compile ","--disable-x86asm ","--disable-inline-asm ","--disable-stripping ","--disable-programs ","--disable-doc ","--extra-cflags='-s USE_PTHREADS' ","--extra-cxxflags='-s USE_PTHREADS' ","--extra-ldflags='-s USE_PTHREADS -s INITIAL_MEMORY=33554432' ","--nm='llvm-nm' ","--ar=emar ","--ranlib=emranlib ","--cc=emcc ","--cxx=em++ ","--objcc=emcc ","--dep-cc=emcc"
];

/**
 * @param {string} packagePath
 * @param {string} gitPath
 * @return {import('../../env.d.ts').INxTargets}
 */
const commandsFn = (packagePath, gitPath) => {
  return {
    [commandNames.package.emmake]: {
      executor: 'nx:run-commands',
      options: {
        commands: [`emconfigure ./configure ${ffmpegFlags.join(' ')}`, 'emmake make'],
        parallel: false,
        cwd: gitPath,
        color: true,
      },
    },
    [commandNames.package.make]: {
      executor: 'nx:run-commands',
      options: {
        commands: [`./configure ${ffmpegFlags.join(' ')}`, 'make'],
        parallel: false,
        cwd: gitPath,
        color: true,
      },
    },
    [commandNames.package.install]: {
      executor: 'nx:run-commands',
      options: {
        commands: ['emmake make install'],
        parallel: false,
        cwd: gitPath,
        color: true,
      },
    },
  };
};

/** @type {import('../../env.d.ts').ICommandsModule} */
export default { commandsFn };
