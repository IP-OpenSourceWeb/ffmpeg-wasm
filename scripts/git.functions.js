import { useShell } from './shell.functions.js';

/**
 * @param {string} url
 * @param {string} branch
 * @param {string} dest
 * @param {number} depth
 * @returns {Promise<string|undefined>}
 */
export function gitClone(url, branch, dest, depth = 1) {
  return useShell(`git clone --branch ${branch} --depth ${depth} ${url} ${dest}`);
}

/**
 * @param {any} repoUrl
 * @returns {Promise<string[]|undefined>}
 */
export function getAllTags(repoUrl) {
  return useShell(`git ls-remote --tags --refs ${repoUrl}`).then((res) => res?.split('\n'));
}

/**
 * @param {string} repoUrl
 * @param {string} tagName
 */
export function getRemoteCommitShaFromTag(repoUrl, tagName) {
  return useShell(`git ls-remote --tags ${repoUrl} ${tagName}`).then((res) => res?.split('\t')[0]);
}

/**
 * @param {string[]} tags
 * @param {RegExp} regex - default allows the tag to contain a leading 'v' or 'n' or no letter then 2 or 3 dot separated numbers
 * @returns {string|undefined}
 */
export function getLatestTag(tags = [], regex = /^(?:[nv])?\d+.\d+(?:.\d+)?$/, replaceLetterRegex = /^[nv]/) {
  console.log(tags);
  const filteredTags = tags
    .map((tag) => tag.split('/').pop())
    .filter((tag) => !!tag && regex.test(tag))
    .map((tag) => tag?.replace(replaceLetterRegex, ''))
    .sort((a, b) => versionCompare(a ?? '', b ?? ''));

  return filteredTags.pop();
}

/**
 * @param {string} a
 * @param {string} b
 */
function versionCompare(a, b) {
  const toNumberArr = (/** @type {string} */ str) =>
    str
      .split('.')
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
