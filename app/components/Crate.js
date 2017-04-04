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
import { getRecords } from '../discogs';
import constants from '../constants';
import record from './assets/record.png';
import { secureFetch } from '../lib/oauth';
import _ from 'lodash';

const RECORD_HEIGHT_SPACE = 80;
const RECORD_TOP_SPACE = 70;
const FIRST_RECORD_TOP_SPACE = 10;
const SCROLL_THRESHOLD_MARGIN = 100;
const RECORD_SCROLL_DIFF_THRESHOLD = 162;

type State = {
  scrollDirection: string,
  records: [],
  recordShown: boolean,
  yPosition: number,
};

export default class Crate extends Component {
  static navigationOptions = {
    tabBar: {
      label: 'My Records',
      icon: ({ tintColor }) => (
        <Image
          source={record}
          style={[styles.icon]}
        />
      ),
    },
  };
  state: State = {
    scrollDirection: 'top',
    records: [],
    recordShown: false,
    yPosition: 0,
  };
  currentY: number = 0;
  scrollViewRef: ScrollView = null;

  componentDidMount() {
    getCollectionPage(1)
      .then(response => {
        this.setState({ records: response.covers });
        if (response.pages > 1) {
          let totalPages = response.pages;
          while (totalPages > 1) {
            getCollectionPage(totalPages--)
              .then(response => {
                const additionalCovers: [] = response.covers;
                this.setState({
                  // $FlowFixMe
                  records: this.state.records.concat(additionalCovers)
                });
              });
          }
        }
      });

    function getCollectionPage(pageNumber) {
      return new Promise((resolve, reject) => {
        return secureFetch('https://api.discogs.com/users/leudanielm/collection?per_page=100&page={pageNumber}')
          .then(resp => {
            resp.json().then(json => {
              const pages: number = json.pagination.pages;
              const covers: [] = _.map(json.releases, release => release.basic_information.thumb);
              resolve({ pages, covers });
            }, reject);
          }, reject);
      });
    }
  }

  render() {
    const { records } = this.state;
    const height = records.length * RECORD_HEIGHT_SPACE;
    return (
      <ScrollView
        style={[styles.crate, { height }]}
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
    const isTopDirection = yPosition <= maxScrollHeight / 2;
    const isBottomDirection = yPosition >= maxScrollHeight / 2;
    //if (isTopDirection || isBottomDirection) {
      this.setState({ yPosition });
    //}
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
  root: {
    backgroundColor: constants.appBackgroundColor,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: constants.appBackgroundColor,
  },
  icon: {
    width: 30,
    height: 30,
  }
})
