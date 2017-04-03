/* @flow */
import { AppRegistry } from 'react-native';
import { TabNavigator } from 'react-navigation';

import Crate from './app/components/Crate';

const SoundsCraterApp = TabNavigator({
  Crate: { screen: Crate },
});

AppRegistry.registerComponent('SoundsCrater', () => SoundsCraterApp);
