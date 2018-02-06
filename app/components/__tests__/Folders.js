/* @flow */
import React from 'react';
import renderer from 'react-test-renderer';
import Folders from '../Folders';

jest.mock('../../discogs', () => ({
  __esModule: true,
  getCollectionFolders: jest.fn(),
}));
jest.mock('../LoadingIndicator', () => 'LoadingIndicator');
jest.mock('TouchableHighlight', () => 'TouchableHighlight');

describe('app/components/Folders', () => {
  it('should render a loader if there is no data', () => {
    const tree = renderer.create(<Folders folders={[]} />);
    expect(tree).toMatchSnapshot();
  });
  it('should render a list of TouchableHighlights if there is data', () => {
    const tree = renderer.create(<Folders folders={[{id: 1, name: 'foo'}, {id: 2, name: 'bar'}]} />);
    expect(tree).toMatchSnapshot();
  });
});
