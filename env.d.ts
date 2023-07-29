export interface INxProject {
  name: string;
  sourceRoot: string;
  projectType: string;
  tags: string[];
  targets: INxTargets;
  [key: string]: any;
}

export interface INxTargets {
  [key: string]: INxTarget | INxCommand;
}

export interface INxTarget {
  executor: string;
  options: INxTargetOptions;
  dependsOn?: string[];
  namedInputs?: { [key: string]: string[] };
}

export interface INxCommand extends INxTarget {
  executor: 'nx:run-commands';
  options: INxTargetOptions;
}

export interface INxTargetOptions {
  commands: string[];
  parallel?: boolean;
  cwd?: string;
  color?: boolean;
}

export interface ICommandsModule {
  commandsFn: (packagePath: string, gitPath: string) => INxTargets;
}

export interface IPackage {
  name: string;
  version: string;
  gitUrl: string;
  gitPath: string;
}
