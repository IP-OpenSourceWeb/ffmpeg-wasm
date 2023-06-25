import { useShell } from '../node-wrappers.js';

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
 * @param {any[]} tags
 * @param {RegExp} regex
 * @returns {string|undefined}
 */
export function getLatestTag(tags, regex = /^n\d+\.\d+(?:\.\d+)?$/) {
  const filteredTags = tags
    .map((tag) => tag.split('/').pop())
    .filter((tag) => regex.test(tag))
    .sort((a, b) => versionCompare(a, b));

  return filteredTags.pop();
}

/**
 * @param {string} a
 * @param {string} b
 */
function versionCompare(a, b) {
  const aParts = a.split('.').map(Number);
  const bParts = b.split('.').map(Number);

  for (let i = 0; i < aParts.length; i++) {
    if (aParts[i] !== bParts[i]) {
      return aParts[i] - bParts[i];
    }
  }

  return 0;
}
