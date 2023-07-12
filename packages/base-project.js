import { packagesPath } from './constants';

/**
 * @param {string} path
 * @returns {import('../packages').INxProject}
 */
export function generateNxProjectJson(path) {
  const sourceRoot = `${packagesPath}/${path}`;
  return {
    name: path,
    projectType: 'library',
    sourceRoot,
    tags: [],
    targets: {
      ...baseCommands(sourceRoot),
      ...dockerCommands(path),
    },
  };
}

/**
 * @param {string} path
 * @returns {import('../packages').INxTargets}
 */
function baseCommands(path) {
  return {
    'update-version': {
      executor: 'nx:run-commands',
      options: {
        commands: ['node ../../scripts/update-version.js'],
        parallel: false,
        cwd: path,
        color: true,
      },
    },
    'clone-repo': {
      executor: 'nx:run-commands',
      options: {
        commands: ['node ../../scripts/update-version.js'],
        parallel: false,
        cwd: path,
        color: true,
      },
    },
  };
}

/**
 * @param {string} path
 * @returns {import('../packages').INxTargets}
 */
function dockerCommands(path) {
  return {
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
