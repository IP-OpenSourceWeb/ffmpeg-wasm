import { ffmpegGitUrl, ffmpegPath } from '../project-vars.js';
import { getAllTags, getLatestTag, gitClone } from './git-utils.js';

const allTags = await getAllTags(ffmpegGitUrl);

if (allTags) {
  const latestFfmpegReleaseTag = getLatestTag(allTags);

  if (latestFfmpegReleaseTag) {
    await gitClone(ffmpegGitUrl, latestFfmpegReleaseTag, ffmpegPath);
  }
}
