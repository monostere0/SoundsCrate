/* @flow */
import React, { Component } from 'react';
import {
  TouchableOpacity,
  Image,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { getThumbsInFolder } from '../discogs';
import type { Folder } from '../discogsTypes';

type Props = {
  folder: Folder,
  onPress: () => void
};

export default class FolderButton extends Component {
  props: Props;
  state: { thumbnails: Array<string> } = { thumbnails: [] };

  componentWillMount() {
    this.getFolderThumbs();
  }

  render(): React.Element<*> {
    const { folder } = this.props;
    const { thumbnails } = this.state;
    return (
      <View style={styles.folderContainer}>
        <View style={styles.thumbsContainer}>
          {thumbnails.map((thumb, index) => (
            <Image
              key={index}
              style={styles.folderThumb}
              source={{ url: thumb }} />
          ))}
        </View>
        <TouchableOpacity
          style={styles.folderTouchable}
          onPress={() => this.props.onPress(folder.id)}>
          <Text style={styles.folderText}>{folder.name} ({folder.count})</Text>
        </TouchableOpacity>
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
    opacity: 0.7,
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
    padding: 5,
  },
});
