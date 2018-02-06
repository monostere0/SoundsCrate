/* @flow */
import { AppRegistry } from 'react-native';
import { StackNavigator } from 'react-navigation';

import FoldersContainer from './app/components/FoldersContainer';
import FolderContainer from './app/components/FolderContainer';

const SoundsCrateApp = StackNavigator({
  Folders: { screen: FoldersContainer },
  Folder: {
    path: 'folder/:id',
    screen: FolderContainer,
  },
}, {
  headerMode: 'none',
});

AppRegistry.registerComponent('SoundsCrate', () => SoundsCrateApp);
