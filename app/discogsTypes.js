/* @flow */

export type RecordsPage = {
  totalPages: number,
  records: Array<string>
};

export type Folder = {
  id: string,
  name: string,
  count: number
};

export type FolderPage = {
  totalPages: number,
  releases: Array<FolderPageReleases>
};

export type FolderPageReleases = {
  instance_id: number,
  rating?: any,
  basic_information: FolderPageReleasesBasicinformation,
  folder_id: number,
  date_added: string,
  Notes: Array<FolderPageReleasesNotes>,
  id: number
};

export type FolderPageReleasesBasicinformation = {
  labels: Array<FolderPageReleasesBasicinformationLabels>,
  formats: Array<FolderPageReleasesBasicinformationFormats>,
  artists: Array<FolderPageReleasesBasicinformationArtists>,
  thumb: string,
  title: string,
  cover_image: string,
  resource_url: string,
  year: number,
  id: number
};

export type FolderPageReleasesBasicinformationLabels = {
  name: string,
  entity_type: string,
  catno: string,
  resource_url: string,
  id: number,
  entity_type_name: string
};

export type FolderPageReleasesBasicinformationFormats = {
  Descriptions: Array<string>,
  text: string,
  name: string,
  qty: string
};

export type FolderPageReleasesBasicinformationArtists = {
  join?: any,
  name: string,
  anv?: any,
  tracks?: any,
  role?: any,
  resource_url: string,
  id: number
};

export type FolderPageReleasesNotes = {
  field_id: number,
  value: string
};
