import { getAllTags, getLatestTag } from '../scripts/git.functions.js';
import { readEnv, writeEnv } from '../scripts/env.functions.js';

const env = await readEnv();

const tags = await getAllTags(env.gitUrl);
const latestTag = getLatestTag(tags);

if (latestTag) {
  env.version = latestTag;
  writeEnv(env);
}
