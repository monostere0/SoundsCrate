/* @flow */
import { secureFetch } from './lib/oauth';
import conf from './conf';
import cache from './cache';

import type { Folder, RecordsPage, FolderPage } from './discogsTypes';

export async function getCollectionFolder(folderId: string, pageNumber: number): Promise<RecordsPage> {
  const { totalPages, releases } = await getCollectionFolderPage(folderId, pageNumber);
  const cachedFolder = cache.get(folderId, pageNumber);
  if (cachedFolder && cachedFolder.records.length) {
    return { totalPages, records: cachedFolder.records };
  } else {
    const releasesRequests = releases
      .filter((release: any) => {
        const { basic_information: { formats } } = release;
        return formats && formats.some((format: any) => format.name === 'Vinyl');
      })
      .map((release: any) => secureFetch(release.basic_information.resource_url));
     const releasesResponse = await Promise.all(releasesRequests);
     const releasesJson = await Promise.all(releasesResponse.map(getJson));
     const records = releasesJson.map((release: any) => release.images.length && release.images[0].resource_url);
     cache.update(folderId, pageNumber, records);

     return { totalPages, records };
  }
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

  return folders.map((folder: any) => ({ id: folder.id, name: folder.name }));
}

async function getCollectionFolderPage(folderId: string, pageNumber: number): Promise<FolderPage> {
  const {
    discogs: {
      api_url: apiUrl,
      endpoints,
      records_per_page: recordsPerPage
    }
  } = conf;
  const { username } = await getIdentity();
  const userFolderUrl = endpoints.folder.replace('{username}', username).replace('{id}', folderId.toString());
  const folderUrl = `${apiUrl}${userFolderUrl}?per_page=${recordsPerPage}&page=${pageNumber}`;
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
