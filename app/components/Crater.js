import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
} from 'react-native';
import Record from './Record';
import { getRecords } from '../discogs';

const RECORD_HEIGHT_SPACE = 80;
const RECORD_TOP_SPACE = 70;
const FIRST_RECORD_TOP_SPACE = 10;
const SCROLL_THRESHOLD_MARGIN = 100;

export default class Crater extends Component {
  panResponder;
  state = {
    scrollDirection: 'top',
    records: [],
    recordShown: false,
  };
  currentY: 0;

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
        scrollEventThrottle={10}
        contentContainerStyle={[styles.container, { height }]}>
        {records.map((image, i) => {
          const zIndex = i + 1;
          const top = !i ? FIRST_RECORD_TOP_SPACE : i * RECORD_TOP_SPACE;
          return (<Record
            onShow={() => this.onRecordShow()}
            onHide={() => this.onRecordHidden()}
            canBeShown={!this.state.recordShown}
            scrollDirection={this.state.scrollDirection}
            cover={image}
            isLast={i === records.length - 1}
            key={i}
            style={{ zIndex, top }}>
            </Record>);
        })}
      </ScrollView>
    );
  }

  onScroll(event) {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const { y } = contentOffset;
    const maxScrollHeight = contentSize.height - layoutMeasurement.height;
    const isTopDirection = y <= maxScrollHeight / 2;
    const isBottomDirection = y >= maxScrollHeight / 2;
    if (isTopDirection || isBottomDirection) {
      this.setState({ scrollDirection: isTopDirection ? 'top' : 'bottom' });
    }
  }

  onRecordShow() {
    this.setState({ recordShown: true });
  }

  onRecordHidden() {
    this.setState({ recordShown: false });
  }
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#4c4c4c',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#4c4c4c',
  },
})
