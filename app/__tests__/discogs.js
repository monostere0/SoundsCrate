/* @flow */
import {
  getCollectionFolder,
  getCollectionFolders,
  getThumbsInFolder,
} from '../discogs';
import { secureFetch } from '../lib/oauth';

jest.mock('../lib/oauth', () => ({
  __esModule: true,
  secureFetch: jest.fn(),
}));
jest.mock('../conf', () => ({
  discogs: {
    api_url: 'http://foo-api.com/',
    endpoints: {
      folder: '{username}/{id}/',
      folders: '{username}/',
      identity: 'identity/',
    },
    records_per_page: 5,
  },
}));

describe('app/discogs', () => {

  afterEach(() => {
    (secureFetch: any).mockReset();
    (secureFetch: any).mockClear();
  });

  it('getCollectionFolder()', async () => {
    (secureFetch: any).mockImplementationOnce(() => Promise.resolve({
      json: () => ({
        username: 'foobar',
      }),
    }));
    (secureFetch: any).mockImplementationOnce(() => Promise.resolve({
      json: () => ({
        releases: [{
          basic_information: {
            cover_image: 'http://foo-api.com/images/bar.jpg',
          }
        }],
        pagination: { pages: 1 },
      }),
    }));

    const folders = await getCollectionFolder('1', 1);
    expect((secureFetch: any).mock.calls).toMatchSnapshot();
    expect(folders).toMatchSnapshot();
  });

  it('getCollectionFolders()', async () => {
    (secureFetch: any).mockImplementationOnce(() => Promise.resolve({
      json: () => ({
        username: 'foobar',
      }),
    }));
    (secureFetch: any).mockImplementationOnce(() => Promise.resolve({
      json: () => ({
        folders: [{
          id: 1,
          name: 'Foo',
          count: 3,
          someOtherProp: 1,
          aCompletelyDifferentProp: 2,
        }],
        pagination: { pages: 1 },
      }),
    }));

    const folders = await getCollectionFolders();
    expect((secureFetch: any).mock.calls).toMatchSnapshot();
    expect(folders).toMatchSnapshot();

  });

  it('getThumbsInFolder()', async () => {
    (secureFetch: any).mockImplementationOnce(() => Promise.resolve({
      json: () => ({
        username: 'foobar',
      }),
    }));
    (secureFetch: any).mockImplementationOnce(() => Promise.resolve({
      json: () => ({
        releases: [{
          basic_information: {
            cover_image: 'http://foo-api.com/images/bar.jpg',
          }
        }],
        pagination: { pages: 1 },
      }),
    }));

    const thumbs = await getThumbsInFolder('1');
    expect((secureFetch: any).mock.calls).toMatchSnapshot();
    expect(thumbs).toMatchSnapshot();
  });
});
