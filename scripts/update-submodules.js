import { useShell } from './shared.js';
import { ffmpegGitUrl, ffmpegPath } from './vars.js';

/**
 * @param {string} url
 * @param {string} tagName
 */
function getRemoteCommitShaFromTag(url, tagName) {
  return useShell(`git ls-remote --tags ${url} ${tagName}`).then((res) => res?.split('\t')[0]);
}

const getLatestFfmpegReleaseTag = await useShell(
  `git ls-remote --tags --refs ${ffmpegGitUrl} | awk -F/ '{print $NF}' | grep -E '^n[0-9]+.[0-9]+(?:.[0-9]+)?$' | sort -V | tail -n 1`
);

if (getLatestFfmpegReleaseTag) {
  const getLatestFfmpegCommitSha = await getRemoteCommitShaFromTag(ffmpegGitUrl, getLatestFfmpegReleaseTag);
  console.log(getLatestFfmpegReleaseTag, getLatestFfmpegCommitSha);
  // configure git submodule to use the latest ffmpeg release commit
  await useShell(`git submodule set-branch --name ${ffmpegPath} ${getLatestFfmpegCommitSha}`);
  await useShell('git submodule update --remote --merge');
}
