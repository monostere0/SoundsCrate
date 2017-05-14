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
import { getCollectionFolders, getThumbsInFolder } from '../discogs';
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
        {!isLoading && folders.map((folder: { id: string, name: string }, index: number) => (
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

type FolderButtonProps = {
  folder: { id: string, name: string },
  onPress: () => void
};

class FolderButton extends Component {
  props: FolderButtonProps;
  state: { thumbnails: Array<string> } = { thumbnails: [] };

  componentWillMount() {
    this.getFolderThumbs();
  }

  render(): React.Element<*> {
    const { folder } = this.props;
    return (
      <View style={styles.folderContainer}>
        <View style={styles.thumbsContainer}>
          {this.state.thumbnails.map((thumb, index) => (
            <Image
              key={index}
              style={styles.folderThumb}
              source={{ url: thumb }} />
          ))}
        </View>
        <TouchableHighlight
          style={styles.folderTouchable}
          underlayColor={'#ccc'}
          onPress={() => this.props.onPress(folder.id)}>
          <Text style={styles.folderText}>{folder.name}</Text>
        </TouchableHighlight>
      </View>
    );
  }

  async getFolderThumbs(): Promise<*> {
    const { id } = this.props.folder;
    const thumbs = await getThumbsInFolder(id);
    this.setState({ thumbnails: thumbs });
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  noFlex: {
    flex: 0,
  },
  folderContainer: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    height: 100,
  },
  thumbsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    opacity: 0.2,
  },
  folderThumb: {
    flex: 1,
    width: 50,
    height: 100,
  },
  folderTouchable: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 1,
  },
  folderText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
});
