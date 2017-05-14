/* @flow */
export default {
  update: updateCache,
  get: getCache,
};

type Entry = { pageNumber: number, records: Array<string> };
type Cache = {
  folderId: {
    totalPages: number,
    entries: Array<Entry>
  }
};

const cache = {};

function updateCache(folderId: string, pageNumber: number, records: Array<string>, totalPages: number) {
  if (!cache[folderId]) {
    cache[folderId] = {
      totalPages,
      entries: []
    };
  }
  cache[folderId].entries.push({ pageNumber, records });
}

function getCache(folderId: string, pageNumber: number): ?{ totalPages: number, records: Array<string> } {
  const cacheByFolderId = cache[folderId];
  if (cacheByFolderId) {
    const entries = cacheByFolderId.entries.find(page => page.pageNumber === pageNumber);
    if (entries) {
      return {
        totalPages: cacheByFolderId.totalPages,
        records: entries.records,
      };      
    }
  }
};

//cache[folderId].find(page => page.pageNumber === pageNumber)
