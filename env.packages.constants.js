export const packagesPath = 'packages';
export const repoDir = 'src';

/** @type {import('./env').IPackage} */
export const ffmpegPackage = {
  name: 'ffmpeg',
  gitUrl: 'https://github.com/FFmpeg/FFmpeg.git',
  gitPath: `${packagesPath}/ffmpeg/${repoDir}`,
  version: '',
};

export const packages = [ffmpegPackage];

export const commandNames = {
  repo: {
    clone: 'repo:clone',
    update: 'repo:update',
    updateVersion: 'repo:update-version',
  },
  package: {
    install: 'install',
    emmake: 'emmake',
    make: 'make',
  },

  container: 'docker',
  containerImg: 'ffmpeg-wasm',
};
