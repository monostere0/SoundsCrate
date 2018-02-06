/* @flow */
import React from 'react';
import renderer from 'react-test-renderer';
import FoldersContainer from '../FoldersContainer';
import { getCollectionFolders } from '../../discogs';

jest.mock('../../discogs', () => ({
  __esModule: true,
  getCollectionFolders: jest.fn(),
}));
jest.mock('../Folders', () => 'Folders');

describe('app/components/FoldersContainer', () => {
  it('should retrieve the data and display the Folders component', async () => {
    // $FlowFixMe
    const tree = await renderer.create(<FoldersContainer />);
    expect(getCollectionFolders).toHaveBeenCalled();
    expect(tree).toMatchSnapshot();
  });
});
