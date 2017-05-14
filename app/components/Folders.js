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
import { getCollectionFolders } from '../discogs';
import LoadingIndicator from './LoadingIndicator';
import FolderButton from './FolderButton';

export type Folder = {
  id: string,
  name: string
};

type State = { folders: Array<Folder> };

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
        {!isLoading && folders.map((folder: Folder, index: number) => (
          <FolderButton
            key={index}
            folder={folder}
            onPress={() => this.openFolder(folder.id)}/>
        ))}
      </ScrollView>
    )
  }

  openFolder(id: string) {
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
});
