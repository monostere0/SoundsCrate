/* @flow */
import React, { Component } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
} from 'react-native';
import { getCollectionFolders } from '../discogs';
import LoadingIndicator from './LoadingIndicator';

type State = {
  folders: []
};

export default class Folders extends Component {
  state: State = { folders: [] }

  componentWillMount() {
    this.getFolders();
  }

  render(): React.Element<*> {
    const { folders } = this.state;
    const isLoading = !Boolean(folders.length);
    const contentContainerStyle = isLoading ? styles.root : styles.noFlex;
    return (
      <ScrollView style={styles.root} contentContainerStyle={contentContainerStyle}>
        {isLoading && <LoadingIndicator/>}
        {!isLoading && folders.map((folder: { id: number, name: string }, index: number) => (
          <TouchableHighlight
            key={index}
            style={styles.folder}
            underlayColor={'#ccc'}
            onPress={() => this.openFolder(folder.id)}>
            <Text style={styles.folderText}>{folder.name}</Text>
          </TouchableHighlight>
        ))}
      </ScrollView>
    )
  }

  openFolder(id: number) {
    const { navigate } = this.props.navigation;
    navigate('Folder', { id });
  }

  async getFolders(): Promise<*> {
    const folders = await getCollectionFolders();
    this.setState({ folders });
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  noFlex: {
    flex: 0,
  },
  folder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#eee',
  },
  folderText: {
    fontSize: 16,
  },
});
