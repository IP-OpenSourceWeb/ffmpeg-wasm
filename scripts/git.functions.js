import { useShell } from './shell.functions.js';

/**
 * @param {string} url
 * @param {string} branch
 * @param {string} dest - The destination folder relative to the current working directory
 * @param {number} depth
 * @returns {Promise<{stdout:string, stderr?:any} | {stdout?:string, stderr:any}>}
 */
export async function gitClone(url, branch, dest, depth = 1) {
  if (!dest.startsWith('.')) dest = `./${dest}`;
  return await useShell(`git clone --branch ${branch} --depth ${depth} ${url} ${dest}`);
}

/**
 * @param {any} repoUrl
 * @returns {Promise<string[]|undefined>}
 */
export async function getAllTags(repoUrl) {
  const { stdout, stderr } = await useShell(`git ls-remote --tags --refs ${repoUrl}`);
  if (!stderr) stdout?.split('\n');
  return undefined;
}

/**
 * @param {string} repoUrl
 * @param {string} tagName
 */
export async function getRemoteCommitShaFromTag(repoUrl, tagName) {
  const { stdout, stderr } = await useShell(`git ls-remote --tags ${repoUrl} ${tagName}`);
  if (!stderr) stdout?.split('\t')[0];
  return undefined;
}

/**
 * @param {string[]} tags
 * @param {RegExp} regex - default allows the tag to contain a leading 'v' or 'n' or no letter then 2 or 3 dot separated numbers
 * @returns {string|undefined}
 */
export function getLatestTag(tags = [], regex = /^(?:[nv])?\d+.\d+(?:.\d+)?$/) {
  console.log(tags);
  const filteredTags = tags
    .map((tag) => tag.split('/').pop())
    .filter((tag) => !!tag && regex.test(tag))
    .sort((a, b) => versionCompare(a ?? '', b ?? '', /^(?:[nv])?/));

  return filteredTags.pop();
}

/**
 * @param {string} a
 * @param {string} b
 * @param {RegExp} replaceLetterRegex
 */
function versionCompare(a, b, replaceLetterRegex) {
  const toNumberArr = (/** @type {string} */ str) =>
    str
      .split('.')
      .map((tag) => tag?.replace(replaceLetterRegex, ''))
      .map(Number)
      .filter((part) => Number.isInteger(part));

  const aParts = toNumberArr(a);
  const bParts = toNumberArr(b);

  for (let i = 0; i < aParts.length; i++) {
    if (aParts[i] !== bParts[i]) {
      return aParts[i] - bParts[i];
    }
  }

  return 0;
}
