/* @flow */
import React, { Component } from 'react';
import { getCollectionFolders } from '../discogs';
import Folders from './Folders';

import type { Folder } from '../discogsTypes';

type State = { folders: Array<Folder> };

export default class FoldersContainer extends Component {
  state: State = { folders: [] }

  componentDidMount() {
    this.getFolders();
  }

  render(): React.Element<*> {
    const { folders } = this.state;
    return (
      <Folders folders={folders} />
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
