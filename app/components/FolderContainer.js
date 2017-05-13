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
  isLazyLoading: boolean
};

export default class FolderContainer extends Component {
  state: State = {
    records: [],
    currentPage: 1,
    totalPages: 1,
    isLazyLoading: false,
  };

  componentWillMount() {
    this.getCollectionFolder(this.state.currentPage);
  }

  render(): React.Element<*> {
    const { records, totalPages, isLazyLoading } = this.state;
    return (
      <View style={styles.root}>
        {!Boolean(records.length) && <LoadingIndicator/>}
        {Boolean(records.length) && <Folder
          records={records}
          totalPages={totalPages}
          onScrollEnd={() => this.onFolderScrollEnd()}/>}
        {isLazyLoading && <LoadingIndicator isOverlay />}
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

  async getFolder(pageNumber: number): Promise<*> {
    const { state } = this.props.navigation;
    this.setState({ isLazyLoading: true });
    const recordsPage = await getCollectionFolder(
      state.params.id,
      pageNumber,
    );
    this.setState({
      currentPage: pageNumber,
      records: this.state.records.concat(recordsPage.records),
      totalPages: recordsPage.totalPages,
      isLazyLoading: false,
    });
  }
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
