/* @flow */
export default {
  update: updateCache,
  get: getCache,
};

type Entry = { pageNumber: number, records: Array<string> };
type Cache = {
  [key: string]: {
    totalPages: number,
    entries: Array<Entry>
  }
};
type CacheParams = { folderId: string, entry: Entry, totalPages: number };

const cache: Cache = {};

function updateCache({ folderId, entry, totalPages }: CacheParams) {
  const cacheByFolderId = cache[folderId] || {
    cachedPages: 0,
    totalPages,
    entries: []
  };
  cacheByFolderId.entries.push(entry);

  cache[folderId] = cacheByFolderId;
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
