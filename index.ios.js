/* @flow */
import { AppRegistry } from 'react-native';
import { StackNavigator } from 'react-navigation';

import Folders from './app/components/Folders';
import CrateContainer from './app/components/CrateContainer';

const SoundsCraterApp = StackNavigator({
  Folders: { screen: Folders },
  Folder: {
    path: 'folder/:id',
    screen: CrateContainer,
  },
}, {
  headerMode: 'none',
});

AppRegistry.registerComponent('SoundsCrater', () => SoundsCraterApp);
