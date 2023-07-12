import { getAllTags, getLatestTag } from './src/git.functions';
import { readEnv, writeEnv } from './src/project.functions';

const env = await readEnv();

const tags = await getAllTags(env.gitUrl);
const latestTag = getLatestTag(tags);

if (latestTag) {
  env.version = latestTag;
  writeEnv(env);
}
