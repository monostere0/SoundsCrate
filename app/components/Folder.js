/* @flow */
import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import Record, { ANIMATION_DURATION } from './Record';
import constants from '../constants';
import _ from 'lodash';

const RECORD_HEIGHT_SPACE = 77;
const RECORD_TOP_SPACE = 70;
const FIRST_RECORD_TOP_SPACE = 10;
const SCROLL_THRESHOLD_MARGIN = 100;
const RECORD_SCROLL_DIFF_THRESHOLD = 162;

type Props = {
  records: Array<string>,
  onScrollEnd?: () => void
};

type State = {
  scrollDirection: string,
  recordShown: boolean,
  yPosition: number
};

export default class Folder extends Component {
  state: State = {
    scrollDirection: 'top',
    records: [],
    recordShown: false,
    yPosition: 0,
  };
  currentY: number = 0;
  scrollViewRef: ScrollView = null;
  debouncedOnScrollEnd: () => void;

  constructor(props: Props) {
    super(props);
    this.debouncedOnScrollEnd = _.debounce(this.props.onScrollEnd, 1000);
  }

  render() {
    const { records } = this.props;
    const height = records.length * RECORD_HEIGHT_SPACE;
    return (
      <ScrollView
        style={[styles.crate, { height }]}
        onScroll={event => this.onScroll(event)}
        ref={ref => this.scrollViewRef = ref}
        scrollEventThrottle={2}
        contentContainerStyle={[styles.container, { height }]}>
        {records.map((image, i) => {
          const zIndex = i + 1;
          const top = !i ? FIRST_RECORD_TOP_SPACE : i * RECORD_TOP_SPACE;
          return (<Record
            onShow={() => this.onRecordShow(top)}
            onHide={() => this.onRecordHide()}
            canBeShown={!this.state.recordShown}
            listYPosition={this.state.yPosition}
            maxYPosition={height}
            cover={image}
            isLast={i === records.length - 1}
            key={i}
            style={{ zIndex, top }}/>);
        })}
      </ScrollView>
    );
  }

  onScroll(event: any): void {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const { y: yPosition } = contentOffset;
    const maxScrollHeight = contentSize.height - layoutMeasurement.height;
    const isBottomReached = yPosition + Dimensions.get('window').height >= contentSize.height;
    if (isBottomReached) {
      this.debouncedOnScrollEnd();
    }
    this.setState({ yPosition });
  }

  onRecordShow(topValue: number): void {
    const { yPosition } = this.state;
    const scrollTopDiff = (topValue - RECORD_SCROLL_DIFF_THRESHOLD) - yPosition;
    if (scrollTopDiff < 0) {
      setTimeout(() => {
        this.scrollViewRef.scrollTo({ y: yPosition + scrollTopDiff, animated: true });
      }, ANIMATION_DURATION);
    }
    this.setState({ recordShown: true });
  }

  onRecordHide(): void {
    this.setState({ recordShown: false });
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: constants.appBackgroundColor,
  },
})
