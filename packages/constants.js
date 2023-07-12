export const packagesPath = 'packages';
export const repoDir = 'src';

/** @type {import('.').IPackage} */
export const ffmpegPackage = {
  name: 'ffmpeg',
  gitUrl: 'https://github.com/FFmpeg/FFmpeg.git',
  gitPath: `${packagesPath}/ffmpeg/${repoDir}`,
  version: '',
};

export const packages = [ffmpegPackage];

// export const moduleTemplate = (/** @type {object} */ data) => `module.exports=${data}`;
