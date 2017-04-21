/* @flow */
import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import record from './assets/record.png';
import { getRecordsPage } from '../discogs';
import Crate from './Crate';

type State = {
  records: Array<string>,
  totalPages: number,
  currentPage: number,
};

export default class CrateContainer extends Component {
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
  state: State = { records: [], currentPage: 1, totalPages: 1 };

  render() {
    const { records } = this.state;
    return (
      <View style={styles.root}>
        {!Boolean(records.length) && 
        <TouchableHighlight
          style={styles.getCollectionButton}
          onPress={() => this.getRecordsCollection()}>
          <Text>Get my collection</Text>
        </TouchableHighlight>}
        {Boolean(records.length) && <Crate
          records={records}
          onScrollEnd={() => this.onCrateScrollEnd()}/>}
      </View>
    );
  }

  getRecordsCollection() {
    this.getRecords(this.state.currentPage);
  }

  onCrateScrollEnd() {
    const { currentPage, totalPages } = this.state;
    if (currentPage < totalPages) {
      this.getRecords(this.state.currentPage + 1);
    } else {
      console.warn('No more records to load!');
    }
  }

  async getRecords(pageNumber: number) {
    const recordsPage = await getRecordsPage(pageNumber);
    this.setState({
      currentPage: pageNumber,
      records: this.state.records.concat(recordsPage.records),
      totalPages: recordsPage.totalPages,
    });
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  icon: {
    width: 30,
    height: 30,
  },
  backgroundCover: {
    flex: 1,
    resizeMode: 'cover',
  },
  getCollectionButton: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    padding: 30,
    bottom: 10,
    width: Dimensions.get('window').width - 20,
    backgroundColor: '#bada55',
    borderRadius: 5,
  },
});