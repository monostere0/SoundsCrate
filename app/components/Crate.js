/* @flow */
import React, { Component } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Record, { ANIMATION_DURATION } from './Record';
import { getRecords } from '../discogs';
import constants from '../constants';

const RECORD_HEIGHT_SPACE = 80;
const RECORD_TOP_SPACE = 70;
const FIRST_RECORD_TOP_SPACE = 10;
const SCROLL_THRESHOLD_MARGIN = 100;
const RECORD_SCROLL_DIFF_THRESHOLD = 160;

type State = {
  scrollDirection: string,
  records: [],
  recordShown: boolean,
};

export default class Crate extends Component {
  state: State = {
    scrollDirection: 'top',
    records: [],
    recordShown: false,
  };
  currentY: number = 0;
  scrollViewRef: ScrollView = null;

  componentDidMount() {
    getRecords()
      .then(records => this.setState({ records }));
  }

  render() {
    const { records } = this.state;
    const height = records.length * RECORD_HEIGHT_SPACE;
    return (
      <ScrollView
        style={[styles.root, { height }]}
        onScroll={event => this.onScroll(event)}
        ref={ref => this.scrollViewRef = ref}
        scrollEventThrottle={10}
        contentContainerStyle={[styles.container, { height }]}>
        {records.map((image, i) => {
          const zIndex = i + 1;
          const top = !i ? FIRST_RECORD_TOP_SPACE : i * RECORD_TOP_SPACE;
          return (<Record
            onShow={() => this.onRecordShow(top)}
            onHide={() => this.onRecordHide()}
            canBeShown={!this.state.recordShown}
            scrollDirection={this.state.scrollDirection}
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
    const { y } = contentOffset;
    const maxScrollHeight = contentSize.height - layoutMeasurement.height;
    const isTopDirection = y <= maxScrollHeight / 2;
    const isBottomDirection = y >= maxScrollHeight / 2;
    this.currentY = y;
    if (isTopDirection || isBottomDirection) {
      this.setState({ scrollDirection: isTopDirection ? 'top' : 'bottom' });
    }
  }

  onRecordShow(topValue: number): void {
    const scrollTopDiff = (topValue - RECORD_SCROLL_DIFF_THRESHOLD) - this.currentY;
    if (scrollTopDiff < 0) {
      setTimeout(() => {
        this.scrollViewRef.scrollTo({ y: this.currentY + scrollTopDiff, animated: true });
      }, ANIMATION_DURATION);
    }
    this.setState({ recordShown: true });
  }

  onRecordHide(): void {
    this.setState({ recordShown: false });
  }
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: constants.appBackgroundColor,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: constants.appBackgroundColor,
  },
})
