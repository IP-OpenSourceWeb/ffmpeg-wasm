import { getToPath } from '../scripts/fs.functions.js';
import { packagesPath } from './packages.constants.js';

/**
 * @param {string} path
 * @param {import('.').INxTargets} commands
 * @returns {import('.').INxProject}
 */
export function generateNxProjectJson(path, commands = {}) {
  const sourceRoot = `${packagesPath}/${path}`;
  return {
    name: path,
    projectType: 'library',
    sourceRoot,
    tags: [],
    targets: {
      ...commands,
      ...baseCommands(sourceRoot),
      ...dockerCommands(path),
    },
  };
}

/**
 * @param {string} path
 * @returns {import('.').INxTargets}
 */
function baseCommands(path) {
  const relativePath = getToPath(path, packagesPath);
  return {
    'update-version': {
      executor: 'nx:run-commands',
      options: {
        commands: [`node ${relativePath}/repo.version-update.js`],
        parallel: false,
        cwd: path,
        color: true,
      },
    },
    'clone-repo': {
      executor: 'nx:run-commands',
      options: {
        commands: [`node ${relativePath}/repo.clone.js`],
        parallel: false,
        cwd: path,
        color: true,
      },
    },
  };
}

/**
 * @param {string} path
 * @returns {import('.').INxTargets}
 */
function dockerCommands(path) {
  return {
    'docker:install': {
      executor: 'nx:run-commands',
      options: {
        commands: [`docker run -t ffmpeg-wasm npx nx run ${path}:install`],
        parallel: false,
        cwd: '',
        color: true,
      },
    },
    'docker:emmake': {
      executor: 'nx:run-commands',
      options: {
        commands: [`docker run -t ffmpeg-wasm npx nx run ${path}:emmake`],
        parallel: false,
        cwd: '',
        color: true,
      },
    },
    'docker:make': {
      executor: 'nx:run-commands',
      options: {
        commands: [`docker run -t ffmpeg-wasm npx nx run ${path}:make`],
        parallel: false,
        cwd: '',
        color: true,
      },
    },
  };
}
