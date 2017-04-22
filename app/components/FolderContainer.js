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
import { getCollectionFolder } from '../discogs';
import Folder from './Folder';
import LoadingIndicator from './LoadingIndicator';

type State = {
  records: Array<string>,
  totalPages: number,
  currentPage: number,
};

export default class FolderContainer extends Component {
  state: State = { records: [], currentPage: 1, totalPages: 1 };

  componentWillMount() {
    this.getCollectionFolder(this.state.currentPage);
  }

  render() {
    const { records } = this.state;
    return (
      <View style={styles.root}>
        {!Boolean(records.length) && <LoadingIndicator/>}
        {Boolean(records.length) && <Folder
          records={records}
          onScrollEnd={() => this.onFolderScrollEnd()}/>}
      </View>
    );
  }

  getCollectionFolder(pageNumber: number) {
    this.getFolder(pageNumber);
  }

  onFolderScrollEnd() {
    const { currentPage, totalPages } = this.state;
    if (currentPage < totalPages) {
      this.getCollectionFolder(this.state.currentPage + 1);
    } else {
      console.warn('No more records to load!');
    }
  }

  async getFolder(pageNumber: number) {
    const { state } = this.props.navigation;
    const recordsPage = await getCollectionFolder(
      state.params.id,
      pageNumber,
    );
    this.setState({
      currentPage: pageNumber,
      records: this.state.records.concat(recordsPage.records),
      totalPages: recordsPage.totalPages,
    });
  }
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
