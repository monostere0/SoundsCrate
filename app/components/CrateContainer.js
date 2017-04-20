/* @flow */
import React, { Component } from 'react';
import { Image, StyleSheet } from 'react-native';
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

  componentWillMount() {
    this.getRecords(this.state.currentPage);
  }

  render() {
    return (
      <Crate
        records={this.state.records}
        onScrollEnd={() => this.onCrateScrollEnd()}/>
    );
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
  icon: {
    width: 30,
    height: 30,
  },
});