/* @flow */
import React, { Component } from 'react';
import { withNavigation } from 'react-navigation';
import {
  TouchableOpacity,
  Image,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import type { Folder } from '../discogsTypes';

type Props = {
  folder: Folder,
  thumbnails: Array<string>
};

class FolderButton extends Component {
  props: Props;

  render(): React.Element<*> {
    const { folder, thumbnails } = this.props;
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
          testID={'folderButton'}
          style={styles.folderTouchable}
          onPress={() => this.openFolder(folder.id)}>
          <View style={styles.folderTextWrapper}>
            <Text style={styles.folderText}>{folder.name}</Text>
            <View style={styles.textCountWrapper}>
              <Text style={styles.folderTextCount}>{folder.count}  </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  openFolder(id: string) {
    const { navigate } = this.props.navigation;
    navigate('Folder', { id });
  }
}

export default withNavigation(FolderButton);

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
  folderTextWrapper: {
    flexDirection: 'row',
  },
  folderText: {
    fontSize: 25,
    fontWeight: 'bold',
    padding: 5,
  },
  textCountWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  folderTextCount: {
    paddingVertical: 12,
    fontSize: 15,
  },
});
