/* @flow */
import { AppRegistry } from 'react-native';
import { StackNavigator } from 'react-navigation';

import Folders from './app/components/Folders';
import FolderContainer from './app/components/FolderContainer';

const SoundsCraterApp = StackNavigator({
  Folders: { screen: Folders },
  Folder: {
    path: 'folder/:id',
    screen: FolderContainer,
  },
}, {
  headerMode: 'none',
});

AppRegistry.registerComponent('SoundsCrater', () => SoundsCraterApp);
