import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';

const RECORD_WIDTH = Dimensions.get('window').width - 20;
const Y_DEFAULT_VALUE = 0;
const Y_ANIMATED_VALUE = -220;
const PERSPECTIVE_DEFAULT_VALUE = 1000;
const PERSPECTIVE_ANIMATED_VALUE = 10000;
const ANIMATION_DURATION = 300;
const ROTATE_X_DEFAULT_VALUE = -60;
const ROTATE_X_ANIMATED_VALUE = 0;

export default class Record extends Component {
  animatedPerspective = new Animated.Value(1000);
  animatedRotateX = new Animated.Value(-1);
  animatedTranslateY = new Animated.Value(0);
  state = {
    transform: [],
    currentDirection: '',
    isShown: false,
  };

  componentWillReceiveProps(nextProps) {
    this._animateRotateX(
      nextProps.scrollDirection === 'top' ?
      ROTATE_X_ANIMATED_VALUE : ROTATE_X_DEFAULT_VALUE
    );
  }

  componentDidMount() {
    this.animatedRotateX.setValue(ROTATE_X_DEFAULT_VALUE);
  }

  render() {
    const perspective = this.animatedPerspective;
    const translateY = this.animatedTranslateY;
    const rotateX = this.animatedRotateX.interpolate({
      inputRange: [ROTATE_X_DEFAULT_VALUE, -1],
      outputRange: ['-30deg', '-40deg'],
      extrapolate: 'clamp'
    });
    const transform = {
      transform: [
        { perspective },
        { rotateX },
        { translateY }
      ],
    };
    return (<AnimatedTouchableOpacity
        style={[styles.record,
          this.props.style,
          transform,
        ]}
        onPress={() => this.onPress()}>
          <Image
            resizeMode={'stretch'}
            source={{uri: this.props.cover}}
            style={styles.cover}>
          </Image>
      </AnimatedTouchableOpacity>);
  }

  onPress() {
    if (this.props.canBeShown) {
      this._show();
    }
  }

  _animateRotateX(value) {
    this._getXAnimation(value).start();
  }

  _getYAnimation(toValue) {
    return this.props.isLast ?
      Animated.delay(0) :
      Animated.spring(
        this.animatedTranslateY,
        { toValue, duration: ANIMATION_DURATION },
      );
  }

  _getXAnimation(toValue) {
    return Animated.spring(
      this.animatedRotateX,
      { toValue, duration: ANIMATION_DURATION },
    );
  }

  _getPerspectiveAnimation(toValue) {
    return Animated.spring(
      this.animatedPerspective,
      { toValue, duration: ANIMATION_DURATION },
    )
  }

  _show() {
    this.props.onShow();
    this.setState({ isShown: true });
    Animated.parallel([
      this._getYAnimation(Y_ANIMATED_VALUE),
      this._getPerspectiveAnimation(PERSPECTIVE_ANIMATED_VALUE),
    ]).start(() => this._hide());
  }

  _hide() {
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
    width: Dimensions.get('window').width - 50,
    height: 300,
    backgroundColor: '#ccc',
    transform: [{
      perspective: 1000,
    }],
    shadowOpacity: 0.3,
    shadowColor: 'black',
  },
  cover: {
    flex: 1
  }
});
