/* @flow */
import cache from '../cache';

describe('app/cache', () => {
  const entry = {
    pageNumber: 1,
    records: ['foo', 'bar', 'baz'],
  };
  const secondPageEntry = {
    pageNumber: 2,
    records: ['some', 'cached', 'data'],
  }
  it('should return undefined if record is not found', () => {
    expect(cache.get(1, 1)).toBe(undefined);
  });
  it('should update the cache with an entry', () => {
    cache.update({
      folderId: 1,
      entry,
      totalPages: 2,
    });
    expect(cache.get(1, 1)).toMatchSnapshot();
  });
  it('should cache by page', () => {
    cache.update({
      folderId: 1,
      entry: secondPageEntry,
      totalPages: 2,
    });
    expect(cache.get(1, 1)).toMatchSnapshot();
    expect(cache.get(1, 2)).toMatchSnapshot();
  });
});
