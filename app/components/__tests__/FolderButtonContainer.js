/* @flow */
import React from 'react';
import renderer from 'react-test-renderer';
import FolderButtonContainer from '../FolderButtonContainer';
import { getThumbsInFolder } from '../../discogs';

jest.mock('../FolderButton', () => 'FolderButton');
jest.mock('../../discogs', () => ({
  __esModule: true,
  getThumbsInFolder: jest.fn()
}));

describe('app/components/FolderButtonContainer', () => {
  it('should render and call discogs.getThumbsInFolder', async () => {
    const tree = await renderer.create(
      <FolderButtonContainer
        folder={{
          id: '1',
          count: 2,
          name: 'foo'
        }} />);
    expect(getThumbsInFolder).toHaveBeenCalledWith(1, 2);
    expect(tree).toMatchSnapshot();
  });
});
