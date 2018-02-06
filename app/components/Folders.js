/* @flow */
import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
} from 'react-native';
import LoadingIndicator from './LoadingIndicator';
import FolderButtonContainer from './FolderButtonContainer';

import type { Folder } from '../discogsTypes';

type Props = { folders: Array<Folder> };

export default class Folders extends Component {
  static defaultProps = { folders: [] };
  props: Props;

  render(): React.Element<*> {
    const { folders } = this.props;
    const isLoading = !Boolean(folders.length);
    const contentContainerStyle = isLoading ? styles.root : styles.noFlex;
    return (
      <ScrollView style={styles.root} contentContainerStyle={contentContainerStyle}>
        {isLoading && <LoadingIndicator/>}
        {!isLoading && folders.map((folder: Folder, index: number) => (
          <FolderButtonContainer
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
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  noFlex: {
    flex: 0,
  },
});
