import { commandNames, packagesPath } from './env.packages.constants.js';
import { getToPath } from './scripts/fs.functions.js';

/**
 * @param {string} packageName
 * @param {import('./env.js').INxTargets} commands
 * @returns {import('./env.js').INxProject}
 */
export function generateNxProjectJson(packageName, commands = {}) {
  const absolutePath = `${packagesPath}/${packageName}`;
  return {
    name: packageName,
    projectType: 'library',
    sourceRoot: absolutePath,
    tags: [],
    targets: {
      ...commands,
      ...baseCommands(packageName, absolutePath),
      ...containerCommands(packageName),
    },
  };
}

/**
 * @param {string} packageName
 * @param {string} absolutePath
 * @returns {import('./env.js').INxTargets}
 */
function baseCommands(packageName, absolutePath) {
  const relativePath = getToPath(absolutePath, packagesPath);
  return {
    [commandNames.repo.update]: {
      executor: 'nx:run-commands',
      options: {
        commands: [`nx run ${packageName}:${commandNames.repo.updateVersion}`, `nx run ${packageName}:${commandNames.repo.clone}`],
        parallel: false,
        cwd: absolutePath,
        color: true,
      },
    },
    [commandNames.repo.updateVersion]: {
      executor: 'nx:run-commands',
      options: {
        commands: [`node ${relativePath}/repo.update-version.js`],
        parallel: false,
        cwd: absolutePath,
        color: true,
      },
    },
    [commandNames.repo.clone]: {
      executor: 'nx:run-commands',
      options: {
        commands: [`node ${relativePath}/repo.clone.js`],
        parallel: false,
        cwd: absolutePath,
        color: true,
      },
    },
  };
}

/**
 * @param {string} packageName
 * @returns {import('./env.js').INxTargets}
 */
function containerCommands(packageName) {
  return {
    [`${commandNames.container}:${commandNames.package.install}`]: {
      executor: 'nx:run-commands',
      options: {
        commands: [
          `${commandNames.container} run -t ${commandNames.containerImg} nx run ${packageName}:${commandNames.package.emmake} && nx run ${packageName}:${commandNames.package.install}`,
        ],
        parallel: false,
        cwd: '',
        color: true,
      },
    },
    [`${commandNames.container}:${commandNames.package.emmake}`]: {
      executor: 'nx:run-commands',
      options: {
        commands: [`${commandNames.container} run -t ${commandNames.containerImg} nx run ${packageName}:${commandNames.package.emmake}`],
        parallel: false,
        cwd: '',
        color: true,
      },
    },
    [`${commandNames.container}:${commandNames.package.make}`]: {
      executor: 'nx:run-commands',
      options: {
        commands: [`${commandNames.container} run -t ${commandNames.containerImg} nx run ${packageName}:${commandNames.package.make}`],
        parallel: false,
        cwd: '',
        color: true,
      },
    },
  };
}
