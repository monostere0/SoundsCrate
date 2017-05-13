/* @flow */

export default {
  update: updateCache,
  get: getCache,
};

const cache = {};

function updateCache(folderId: string, pageNumber: number, records: Array<string>) {
  if (!cache[folderId]) {
    cache[folderId] = [];
  }
  cache[folderId].push({ pageNumber, records });
}

function getCache(folderId: string, pageNumber: number): { pageNumber: number, records: Array<string> } {
  return cache[folderId] && cache[folderId].find(page => page.pageNumber === pageNumber);
};
