/* @flow */
import React from 'react';
import {
  ScrollView,
  StyleSheet,
} from 'react-native';
import LoadingIndicator from './LoadingIndicator';
import FolderButtonContainer from './FolderButtonContainer';

import type { Folder } from '../discogsTypes';

type Props = { folders: Array<Folder> };

export default function Folders(props: Props): React.Element<*> {
  const { folders } = props;
  const isLoading = !Boolean(folders.length);
  const contentContainerStyle = isLoading ? styles.root : styles.noFlex;
  return (
    <ScrollView style={styles.root} contentContainerStyle={contentContainerStyle}>
      {isLoading && <LoadingIndicator/>}
      {!isLoading && folders.map((folder: Folder, index: number) => (
        <FolderButtonContainer
          key={index}
          folder={folder}/>
      ))}
    </ScrollView>
  );
}
Folders.defaultProps = { folders: [] };

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  noFlex: {
    flex: 0,
  },
});
