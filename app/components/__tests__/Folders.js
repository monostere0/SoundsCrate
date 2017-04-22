/* @flow */
import React from 'react';
import renderer from 'react-test-renderer';
import Folders from '../Folders';
import { getCollectionFolders } from '../../discogs';

jest.mock('../../discogs', () => ({
  __esModule: true,
  getCollectionFolders: jest.fn(),
}));
jest.mock('../LoadingIndicator', () => 'LoadingIndicator');
jest.mock('TouchableHighlight', () => 'TouchableHighlight');

describe('app/components/Folders', () => {
  it('should render a loader if there is no data', async () => {
    // $FlowFixMe
    getCollectionFolders.mockImplementationOnce(() => Promise.resolve([]));
    const tree = await renderer.create(<Folders />);
    expect(tree).toMatchSnapshot();
  });
  it('should render a list of TouchableHighlights if there is data', async () => {
    // $FlowFixMe
    getCollectionFolders.mockImplementationOnce(() => Promise.resolve([
      {id: 1, name: 'foo'},
      {id: 2, name: 'bar'},
    ]));
    const tree = await renderer.create(<Folders />);
    expect(tree).toMatchSnapshot();
  });
});
