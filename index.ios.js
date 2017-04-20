/* @flow */
import { AppRegistry } from 'react-native';
import { TabNavigator } from 'react-navigation';

import CrateContainer from './app/components/CrateContainer';

const SoundsCraterApp = TabNavigator({
  Crate: { screen: CrateContainer },
});

AppRegistry.registerComponent('SoundsCrater', () => SoundsCraterApp);
