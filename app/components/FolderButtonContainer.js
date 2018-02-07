/* @flow */
import React, { Component } from 'react';
import { getThumbsInFolder } from '../discogs';
import type { Folder } from '../discogsTypes';
import FolderButton from './FolderButton'

type Props = { folder: Folder };

export default class FolderButtonContainer extends Component<Props, *> {
  props: Props;
  state: { thumbnails: Array<string> } = { thumbnails: [] };

  componentDidMount() {
    this.getFolderThumbs();
  }

  render(): React$Node {
    const { folder } = this.props;
    const { thumbnails } = this.state;
    return (
      <FolderButton
        folder={folder}
        thumbnails={thumbnails}/>
    );
  }

  async getFolderThumbs(): Promise<*> {
    const { id, count } = this.props.folder;
    const thumbs = await getThumbsInFolder(id, Math.min(count, 4));
    this.setState({ thumbnails: thumbs });
  }
}
