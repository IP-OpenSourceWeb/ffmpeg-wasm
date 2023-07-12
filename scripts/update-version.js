import { getAllTags, getLatestTag } from './src/git.functions';
import { readFile, writeFile } from './src/fs.functions';

const env = JSON.parse(await readFile(`env.json`));

const tags = await getAllTags(env.gitUrl);
const latestTag = getLatestTag(tags);

env.version = latestTag;

if (latestTag) {
  writeFile(`${env.name}/env.json`, env);
}
