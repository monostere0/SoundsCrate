/* @flow */
import { AppRegistry } from 'react-native';
import { StackNavigator } from 'react-navigation';

import CrateContainer from './app/components/CrateContainer';

const SoundsCraterApp = StackNavigator({
  Crate: { screen: CrateContainer },
});

AppRegistry.registerComponent('SoundsCrater', () => SoundsCraterApp);
