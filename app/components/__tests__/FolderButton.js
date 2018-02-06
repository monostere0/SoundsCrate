/* @flow */
import React from 'react';
import renderer from 'react-test-renderer';
import FolderButton from '../FolderButton';

jest.mock('react-navigation', () => ({
  __esModule: true,
  withNavigation: cls => cls
}));
jest.mock('TouchableOpacity', () => 'TouchableOpacity');

describe('app/components/FolderButton', () => {
  it('should render', () => {
    const tree = renderer.create(
      <FolderButton
        thumbnails={[ 'foo', 'bar' ]}
        folder={{ id: 1, name: 'foo', count: 2 }}
      />
    );
    expect(tree).toMatchSnapshot();
  });
  it('should navigate to another page onPress', () => {
    const navigate = jest.fn();
    const tree = renderer.create(
      <FolderButton
        navigation={{ navigate }}
        thumbnails={[ 'foo', 'bar' ]}
        folder={{ id: 1, name: 'foo', count: 2 }}
      />
    ).toJSON();
    // Replace with tree.findByProps({ testID: 'folderButton' }) after upgrading
    // react-test-renderer
    tree.children[1].props.onPress();
    expect(navigate).toHaveBeenCalledWith('Folder', { id: 1 });
  });
});
