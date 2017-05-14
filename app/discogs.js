/* @flow */
import { secureFetch } from './lib/oauth';
import conf from './conf';
import cache from './cache';

import type {
  Folder,
  RecordsPage,
  FolderPage,
  FolderPageReleases
} from './discogsTypes';

export async function getCollectionFolder(folderId: string, pageNumber: number): Promise<RecordsPage> {
  const cachedFolder = cache.get(folderId, pageNumber);
  if (cachedFolder) {
    const { totalPages, records } = cachedFolder;
    return { totalPages, records };
  } else {
     const { totalPages, releases } = await getCollectionFolderPage(folderId, pageNumber);
     const records = releases.map(getReleaseCoverImage);
     const entry = { pageNumber, records };
     cache.update({
       folderId,
       entry,
       totalPages
     });

     return { totalPages, records };
  }
}

export async function getThumbsInFolder(folderId: string, numberOfThumbs: number = 4): Promise<*> {
  const { totalPages, releases } = await getCollectionFolderPage(folderId, 1, numberOfThumbs);
  return releases.map(getReleaseCoverImage);
}

export async function getCollectionFolders(): Promise<Array<Folder>> {
  const {
    discogs: {
      api_url: apiUrl,
      endpoints,
    }
  } = conf;
  const { username } = await getIdentity();
  const foldersCollectionUrl = endpoints.folders.replace('{username}', username);
  const foldersUrl = `${apiUrl}${foldersCollectionUrl}`;
  const foldersResponse = await secureFetch(foldersUrl);
  const { folders } = await getJson(foldersResponse);

  return folders.map(folder => ({
    id: folder.id,
    name: folder.name,
    count: folder.count,
  }));
}

async function getCollectionFolderPage(folderId: string, pageNumber: number, recordsPerPage?: number): Promise<FolderPage> {
  const {
    discogs: {
      api_url: apiUrl,
      endpoints,
      records_per_page,
    }
  } = conf;
  const { username } = await getIdentity();
  const perPage = recordsPerPage || records_per_page;
  const userFolderUrl = endpoints.folder.replace('{username}', username).replace('{id}', folderId.toString());
  const folderUrl = `${apiUrl}${userFolderUrl}?per_page=${perPage}&page=${pageNumber}`;
  const folderResponse = await secureFetch(folderUrl);
  const {
    releases,
    pagination: { pages: totalPages }
  } = await getJson(folderResponse);

  return { totalPages, releases };
}

async function getIdentity(): Promise<*> {
  const {
    discogs: {
      api_url: apiUrl,
      endpoints,
    }
  } = conf;
  const response = await secureFetch(`${apiUrl}${endpoints.identity}`);
  return await getJson(response);
}

function getJson(response: Response): Promise<*> {
  return response.json();
}

function getReleaseCoverImage(release: FolderPageReleases): string {
  return release.basic_information.cover_image;
}
