/* @flow */
export default {
  discogs: {
    oauth: {
      key: 'YOUR_CONSUMER_KEY',
      secret: 'YOUR_CONSUMER_SECRET',
      request_token_url: 'https://api.discogs.com/oauth/request_token',
      authorize_url: 'https://discogs.com/oauth/authorize?oauth_token=',
      access_token_url: 'https://api.discogs.com/oauth/access_token',
      callback_url: 'soundscrate://',
    },
    api_url: 'https://api.discogs.com/',
    endpoints: {
      folders: 'users/{username}/collection/folders',
      folder: 'users/{username}/collection/folders/{id}/releases',
      identity: 'oauth/identity',
    },
    records_per_page: 20,
  },
  app_user_agent: 'Sounds-Crate/1.0',
  storage_app_id: '@SoundsCrate:',
};
