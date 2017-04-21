/* @flow */
import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';
import constants from '../constants';

const RECORD_WIDTH = Dimensions.get('window').width - 50;
const Y_DEFAULT_VALUE = 0;
const Y_ANIMATED_VALUE = -220;
const PERSPECTIVE_DEFAULT_VALUE = 1000;
const PERSPECTIVE_ANIMATED_VALUE = 10000;
export const ANIMATION_DURATION = 300;
const ROTATE_X_DEFAULT_VALUE = -60;
const ROTATE_X_ANIMATED_VALUE = 0;
const PERSPECTIVE_MULTIPLY_FACTOR = 10;
const MIN_PERSPECTIVE_VALUE = 120;

type Props = {
  onShow: () => void,
  onHide: () => void,
  canBeShown: boolean,
  cover: string,
  isLast: boolean,
  key?: number,
  style?: any,
  listYPosition: number,
  maxYPosition: number,
};

type State = {
  transform: Array<Object>,
  currentDirection: string,
  isShown: boolean,
};

export default class Record extends Component {
  animatedPerspective: Animated.Value = new Animated.Value(1000);
  animatedRotateX: Animated.Value = new Animated.Value(-1);
  animatedTranslateY: Animated.Value = new Animated.Value(0);
  state: State = {
    transform: [],
    currentDirection: '',
    isShown: false,
  };

  componentWillReceiveProps(nextProps: Props) {
    this._animateRotateX(nextProps.listYPosition);
  }

  componentDidMount() {
    this.animatedRotateX.setValue(ROTATE_X_DEFAULT_VALUE);
  }

  render() {
    const perspective = this.animatedPerspective;
    const translateY = this.animatedTranslateY;
    const rotateX = this.animatedRotateX.interpolate({
      inputRange: [0, this.props.maxYPosition],
      outputRange: ['-40deg', '-10deg'],
      extrapolate: 'clamp'
    });
    const transformProps = [
      { perspective },
      { rotateX },
      { translateY }
    ];
    return (<AnimatedTouchableOpacity
        style={[styles.record,
          this.props.style,
          { transform: transformProps },
        ]}
        onPress={() => this.onPress()}>
          <Image
            resizeMode={'stretch'}
            source={{uri: this.props.cover}}
            style={styles.cover}>
          </Image>
      </AnimatedTouchableOpacity>);
  }

  onPress(): void {
    if (this.props.canBeShown) {
      this._show(() => this._hide());
    }
  }

  _animateRotateX(value): void {
    this._getXAnimation(value).start();
  }

  _getYAnimation(toValue: number): Animated.Value {
    return Animated.spring(
      this.animatedTranslateY,
      {
        toValue,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      },
    );
  }

  _getXAnimation(toValue: number): Animated.Value {
    return Animated.spring(
      this.animatedRotateX,
      {
        toValue,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      },
    );
  }

  _getPerspectiveAnimation(toValue: number): Animated.Value {
    return Animated.spring(
      this.animatedPerspective,
      {
        toValue,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      },
    )
  }

  _show(callback?: () => void): void {
    this.props.onShow();
    const multipledTop = Math.max(this.props.style.top, MIN_PERSPECTIVE_VALUE) * PERSPECTIVE_MULTIPLY_FACTOR;
    const perspectiveValue = Math.min(multipledTop, PERSPECTIVE_ANIMATED_VALUE);
    this.setState({ isShown: true });
    Animated.parallel([
      this._getYAnimation(Y_ANIMATED_VALUE / (this.props.isLast ? 2 : 1)),
      this._getPerspectiveAnimation(perspectiveValue),
    ]).start(() => callback && callback());
  }

  _hide(): void {
    this.props.onHide();
    Animated.parallel([
      this._getYAnimation(Y_DEFAULT_VALUE),
      this._getPerspectiveAnimation(PERSPECTIVE_DEFAULT_VALUE),
    ]).start(() => {
      this.setState({ isShown: false });
    });
  }
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableHighlight);

const styles = StyleSheet.create({
  record: {
    flexGrow: 1,
    position: 'absolute',
    alignSelf: 'stretch',
    marginHorizontal: 25,
    width: RECORD_WIDTH,
    height: 300,
    backgroundColor: constants.recordBackgroundColor,
    transform: [{ perspective: 1000 }],
    shadowOpacity: 0.3,
    shadowColor: 'black',
  },
  cover: {
    flex: 1
  }
});
