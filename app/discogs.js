/* @flow */
import { secureFetch } from './lib/oauth';
import conf from './conf';
import qs from 'query-string';

type RecordsPage = {
  totalPages: number,
  records: Array<string>,
}

export async function getRecordsPage(pageNumber: number): Promise<RecordsPage> {
  const { totalPages, releases } = await getCollectionPage(pageNumber);
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

async function getCollectionPage(pageNumber: number): Promise<*> {
  const {
    discogs: {
      api_url: apiUrl,
      endpoints,
      records_per_page: recordsPerPage
    }
  } = conf;
  const userCollectionUrl = endpoints.collection.replace('{username}', 'leudanielm');
  const collectionUrl = `${apiUrl}${userCollectionUrl}?per_page=${recordsPerPage}&page=${pageNumber}`;
  const collectionResponse = await secureFetch(collectionUrl);
  const collectionJson = await getJson(collectionResponse);
  const { releases, pagination: { pages: totalPages } } = collectionJson;

  return { totalPages, releases };
}

function getJson(response): Promise<*> {
  return response.json();
}
