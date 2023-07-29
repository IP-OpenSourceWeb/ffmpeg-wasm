import { getToRootPath, readFile, writeFile } from './fs.functions.js';

/**
 * @returns {Promise<import('../env.js').IPackage>}
 * @param {string} path
 */
export async function readEnv(path = '.') {
  return JSON.parse(await readFile(`${path}/env.json`));
}

/**
 * @param {import('../env.js').IPackage} env
 * @param {string} path
 * @returns {Promise<void>}
 */
export async function writeEnv(env, path = '.') {
  return writeFile(`${path}/env.json`, JSON.stringify(env, null, 2));
}

/**
 * @param {string} path
 * @return {Promise<{commandsFn:import('../env.js').ICommandsModule['commandsFn'], error?:any} | {commandsFn?:import('../env.js').ICommandsModule['commandsFn'], error: any}>}
 */
export async function readCommands(path) {
  try {
    const absolutePath = `${await getToRootPath()}/${path}/commands.js`;
    return { commandsFn: (await import(absolutePath)).default.commandsFn };
  } catch (e) {
    return {
      error: await e,
    };
  }
}

/**
 * @param {string} path
 * @returns {Promise<void>}
 */
export function writeCommands(path) {
  const template = `
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
  const commands = basePackageCommands(projectPath,packageFlags, emscriptenFlags);
  return commands;
};

/** @type {import('../../env.d.ts').ICommandsModule} */
export default { commandsFn };
  
`;

  return writeFile(`${path}/commands.js`, template);
}

/**
 * @param {string} path
 * @param {import('../env.js').INxProject} data
 * @returns {Promise<void>}
 */
export function writeProjectJson(path, data) {
  return writeFile(`${path}/project.json`, JSON.stringify(data, null, 2));
}
