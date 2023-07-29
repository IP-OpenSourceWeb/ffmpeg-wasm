import { basePackageCommands } from '../../env.packages.functions.js';

const emscriptenFlags = [];

const packageFlags = [
  '--disable-x86asm',
  '--disable-stripping',

  // ,"--target-os=none ","--arch=x86_32 ","--enable-cross-compile ","--disable-x86asm ","--disable-inline-asm ","--disable-stripping ","--disable-programs ","--disable-doc ","--extra-cflags='-s USE_PTHREADS' ","--extra-cxxflags='-s USE_PTHREADS' ","--extra-ldflags='-s USE_PTHREADS -s INITIAL_MEMORY=33554432' ","--nm='llvm-nm' ","--ar=emar ","--ranlib=emranlib ","--cc=emcc ","--cxx=em++ ","--objcc=emcc ","--dep-cc=emcc"
];

/**
 * @param {string} projectPath
 * @param {string} gitPath
 * @return {import('../../env.d.ts').INxTargets}
 */
const commandsFn = (projectPath, gitPath) => {
  const commands = basePackageCommands(projectPath, packageFlags, emscriptenFlags);
  return commands;
};

/** @type {import('../../env.d.ts').ICommandsModule} */
export default { commandsFn };
