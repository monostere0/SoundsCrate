/* @flow */
import React, { Component } from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import record from './assets/record.png';
import needle from './assets/needle.png';
import player from './assets/player.png';

const ANIMATION_DURATION = 500;

type Props = { isOverlay?: boolean };

export default class LoadingIndicator extends Component<Props, *> {
  needleAnimation = new Animated.Value(0);

  componentDidMount() {
    this.animateNeedle();
  }

  render(): React$Node {
    const rotate = this._getInterpolation('0deg', '-30deg');
    const recordRotate = this._getInterpolation('0deg', '360deg');
    const translateX = this._getInterpolation(0, 6);
    const translateY = this._getInterpolation(0, 4);
    const transform = [{ rotate }, { translateX }, { translateY }];
    const { isOverlay } = this.props;

    return (
      <View style={[styles.root, isOverlay && styles.overlayRoot]}>
        <Image style={styles.player} source={player} />
        <Animated.Image
          style={[styles.record, {
            transform: [{ rotate: recordRotate }] }
          ]} source={record} />
        <Animated.Image style={[styles.needle, { transform }]} source={needle} />
      </View>
    );
  }

  animateNeedle() {
    // $FlowFixMe: Use Animated.Value until type CompositeAnimation is being exposed from React Native
    this._getNeedleAnimation(30).start(({ finished }: any) => {
      // $FlowFixMe: Use Animated.Value until type CompositeAnimation is being exposed from React Native
      finished && this._getNeedleAnimation(0).start(({ finished }: any) => {
        finished && this.animateNeedle();
      });
    });
  }

  _getInterpolation(...outputRange: Array<string | number>): Animated.Value {
    return this.needleAnimation.interpolate({
      inputRange: [0, 30],
      outputRange,
    });
  }

  // $FlowFixMe: Use Animated.Value until type CompositeAnimation is being exposed from React Native
  _getNeedleAnimation(toValue: number): Animated.Value {
    return Animated.spring(
      this.needleAnimation,
      { toValue,
        duration: ANIMATION_DURATION,
        useNativeDriver: true, }
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayRoot: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  player: {
    position: 'absolute',
    width: 100,
    height: 100,
  },
  record: {
    position: 'absolute',
    width: 80,
    height: 80,
  },
  needle: {
    width: 20,
    height: 45,
    marginTop: -30,
    marginLeft: 65,
  },
});
