import { commandNames, dependsOnNames, nxProjectRoot, nxRoot, packagesPath, repoDir } from './env.packages.constants.js';
import { getToPath } from './scripts/fs.functions.js';

/**
 * @param {string} packageName
 * @param {import('./env.js').INxTargets} commands
 * @returns {import('./env.js').INxProject}
 */
export function generateNxProjectJson(packageName, commands = {}) {
  const projectPath = `${packagesPath}/${packageName}`;
  return {
    name: packageName,
    projectType: 'library',
    sourceRoot: projectPath,
    tags: [],
    targets: {
      ...commands,
      ...baseCommands(packageName, projectPath),
      ...containerCommands(packageName, commands),
    },
  };
}

/**
 * @param {string} packageName
 * @param {string} projectPath
 * @returns {import('./env.js').INxTargets}
 */
function baseCommands(packageName, projectPath) {
  const relativePath = getToPath(projectPath, packagesPath);
  return {
    [commandNames.repo.update]: baseCommand({
      commands: [`nx run ${packageName}:${commandNames.repo.updateVersion}`, `nx run ${packageName}:${commandNames.repo.clone}`],
      cwd: projectPath,
    }),
    [commandNames.repo.updateVersion]: baseCommand({
      commands: [`node ${relativePath}/repo.update-version.js`],
      cwd: projectPath,
    }),
    [commandNames.repo.clone]: baseCommand({
      commands: [`node ${relativePath}/repo.clone.js`],
      cwd: projectPath,
    }),
  };
}

/**
 * @param {string} projectPath
 * @param {string[]} packageFlags
 * @param {string[]} emscriptenFlags
 * @return {import('./env.d.ts').INxTargets}
 */
export function basePackageCommands(projectPath, packageFlags, emscriptenFlags) {
  return {
    [commandNames.package.configure]: {
      dependsOn: [`${dependsOnNames.envJson}`],
      ...baseCommand({
        commands: [`emconfigure ./configure ${packageFlags.join(' ')}`],
        cwd: `${projectPath}/${repoDir}`,
      }),
    },
    [commandNames.package.emmake]: {
      dependsOn: [`${commandNames.package.configure}`],
      ...baseCommand({
        commands: [`emmake make ${emscriptenFlags.join(' ')}`],
        cwd: `${projectPath}/${repoDir}`,
      }),
    },

    [commandNames.package.install]: {
      dependsOn: [`${commandNames.package.emmake}`],
      ...baseCommand({
        commands: ['emmake make install'],
        cwd: `${projectPath}/${repoDir}`,
      }),
    },

    [commandNames.package.make]: {
      dependsOn: [`${commandNames.package.configure}`],
      ...baseCommand({
        commands: [`make`],
        cwd: `${projectPath}/${repoDir}`,
      }),
    },
  };
}

/**
 * @param {string} packageName
 * @param {import('./env.js').INxTargets} commands
 * @returns {import('./env.js').INxTargets}
 */
function containerCommands(packageName, commands) {
  return Object.keys(commands).reduce((acc, key) => {
    const runContainCommand = baseCommand({
      commands: [`${commandNames.container} run -t ${commandNames.containerImg} nx run ${packageName}:${key}`],
    });

    const runInContainerCommand = baseCommand({
      commands: [
        `node shell.run-current-path.js \
"${commandNames.container} \
run -v $PWD:/${commandNames.containerImg} -t ${commandNames.containerImg} \
find ./packages -type f -exec dos2unix {} + && nx run ${packageName}:${key}"`,
      ],
    });

    acc[`${commandNames.container}:${key}`] = runContainCommand;
    acc[`${commandNames.container}:mount:${key}`] = runInContainerCommand;
    return acc;
  }, {});
}

/**
 * @param {import('./env.js').INxTargetOptions} options
 * @returns {import('./env.js').INxTarget}
 */
function baseCommand(options) {
  return {
    executor: 'nx:run-commands',
    options: {
      parallel: false,
      cwd: '',
      color: true,
      ...options,
    },
  };
}
