/* @flow */
import { secureFetch } from './lib/oauth';
import conf from './conf';
import qs from 'query-string';

type RecordsPage = {
  totalPages: number,
  records: Array<string>,
}

export async function getCollectionFolder(folderId: number, pageNumber: number): Promise<RecordsPage> {
  const { totalPages, releases } = await getCollectionFolderPage(folderId, pageNumber);
  const releasesRequests = releases
    .filter(release => {
      const { basic_information: { formats } } = release;
      return formats && formats.some(format => format.name === 'Vinyl');
    })
    .map(release => secureFetch(release.basic_information.resource_url));
   const releasesResponse = await Promise.all(releasesRequests);
   const releasesJson = await Promise.all(releasesResponse.map(getJson));
   const records = releasesJson.map(release => release.images.length && release.images[0].resource_url);

   return { totalPages, records };
}

export async function getCollectionFolders(): Promise<*> {
  const {
    discogs: {
      api_url: apiUrl,
      endpoints,
      records_per_page: recordsPerPage
    }
  } = conf;
  const { username } = await getIdentity();
  const foldersCollectionUrl = endpoints.folders.replace('{username}', username);
  const foldersUrl = `${apiUrl}${foldersCollectionUrl}`;
  const foldersResponse = await secureFetch(foldersUrl);
  const { folders } = await getJson(foldersResponse);

  return folders.map(folder => ({ id: folder.id, name: folder.name }));
}

async function getCollectionFolderPage(folderId: number, pageNumber: number): Promise<*> {
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

function getJson(response): Promise<*> {
  return response.json();
}
