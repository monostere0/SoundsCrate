/* @flow */
import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
} from 'react-native';
import { getCollectionFolders } from '../discogs';

type State = {
  folders: [],
};

export default class Folders extends Component {
  state: State = { folders: [] }

  componentWillMount() {
    this.getFolders();
  }

  render() {
    return (
      <ScrollView style={styles.root}>
        {this.state.folders.map((folder, index) => (
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

  async getFolders() {
    const folders = await getCollectionFolders();
    this.setState({ folders });
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
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
  }
});
