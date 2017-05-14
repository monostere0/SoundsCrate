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
    // const releasesRequests = releases
    //   .filter(filterByVinylFormat)
    //   .map(release => secureFetch(release.basic_information.resource_url));
    //  const releasesResponse = await Promise.all(releasesRequests);
    //  const releasesJson = await Promise.all(releasesResponse.map(getJson));
    //  const records = releasesJson.map(release => release.images.length && release.images[0].resource_url);
     const { totalPages, releases } = await getCollectionFolderPage(folderId, pageNumber);
     const records = releases
      .filter(filterByVinylFormat)
      .map(release => release.basic_information.cover_image);
     cache.update(folderId, pageNumber, records, totalPages)

     return { totalPages, records };
  }
}

export async function getThumbsInFolder(folderId: string): Promise<*> {
  const { totalPages, releases } = await getCollectionFolderPage(folderId, 1, 4);
  return releases
    .filter(filterByVinylFormat)
    .map(release => release.basic_information.cover_image);
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

  return folders.map(folder => ({ id: folder.id, name: folder.name, count: folder.count }));
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

function getJson(response: any): Promise<*> {
  return response.json();
}

function filterByVinylFormat(release: FolderPageReleases): boolean {
  const { basic_information: { formats } } = release;
  return formats && formats.some(format => format.name === 'Vinyl');
}
