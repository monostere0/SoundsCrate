/* @flow */
import React from 'react';
import renderer from 'react-test-renderer';
import FolderContainer from '../FolderContainer';
import { getCollectionFolder } from '../../discogs';

jest.mock('../Folder', () => 'Folder');
jest.mock('../../discogs', () => ({
  __esModule: true,
  getCollectionFolder: jest.fn()
}));

describe('app/components/FolderContainer', () => {
  it('should render and call discogs.getCollectionFolder', async () => {
    const tree = await renderer.create(
      <FolderContainer navigation={{ state: { params: { id: 1 } } }} />);
    expect(getCollectionFolder).toHaveBeenCalledWith(1, 1);
    expect(tree).toMatchSnapshot();
  });
});
