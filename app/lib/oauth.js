/* @flow */
import conf from '../conf';
import qs from 'query-string';
import _ from 'lodash';
import { AsyncStorage, Linking } from 'react-native';

type OAuthData = { oauth_token: string, oauth_token_secret: string };

let storedTokenSecret: ?string = null;
let storedOAuthData: OAuthData = { oauth_token: '', oauth_token_secret: '' };

const STORAGE_APP_ID = '@SoundsCrater:';

export function secureFetch(url: string, config: Object = {}): Promise<*> {
  return AsyncStorage.getItem(`${STORAGE_APP_ID}oauthToken`)
    .then(data => {
      const oauthToken = JSON.parse(data);
      if (oauthToken && oauthToken.oauth_token) {
        storedOAuthData = oauthToken;
        return oAuthFetch(url, config);
      } else {
        return startOAuthFlow().then(() => {
          return oAuthFetch(url, config);
        });
      }
    });
}

function oAuthFetch(url: string, config: Object = {}): Promise<*> {
  const secureConfig = Object.assign(config, {
    headers: getAppHeaders(getSecureHeaders(storedOAuthData))
  });
  return fetch(url, secureConfig);
}

function startOAuthFlow() {
  return initialize()
    .then(oauth => redirectToLogin(`${conf.discogs.oauth.authorize_url}${oauth.oauth_token}`));
}

function initialize() {
  return new Promise((resolve, reject) => {
    fetch(conf.discogs.oauth.request_token_url, {
      method: 'GET',
      headers: getAppHeaders(getInitialHeaders())
    }).then((response) => {
      resolveAndParseQs(response, parsedQs => {
        storedTokenSecret = parsedQs.oauth_token_secret;
        resolve(parsedQs);
      });
    }, reject);
  });
}

function redirectToLogin(url): Promise<*> {
  return new Promise((resolve, reject) => {
    Linking.addEventListener('url', function urlListener(event) {
      const urlQueryString = event.url.match(/(\w*\=\w*)+/g).join('&');
      const { oauth_token, oauth_verifier } = qs.parse(urlQueryString);
      authorizeAndStoreToken(oauth_token, oauth_verifier).then(resolve, reject);
      Linking.removeEventListener('url', urlListener);
    });
    openURL(url, reject);
  });
}

function storeSecret(tokenSecret: string) {
  storedTokenSecret = tokenSecret;
}

function openURL(url, reject) {
  Linking.canOpenURL(url)
    .then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        reject();
      }
    })
    .catch(reject);
}

function authorizeAndStoreToken(token: string, verifier: string): Promise<*> {
  return authorize(token, verifier)
    .then(() => accessToken(token, verifier))
    .then(response => {
      storedOAuthData = response;
      return AsyncStorage.setItem(`${STORAGE_APP_ID}oauthToken`, JSON.stringify(response));
    });
}

function authorize(token: string, verifier: string): Promise<*> {
  return new Promise((resolve, reject) => {
    fetch(conf.discogs.oauth.request_token_url, {
      method: 'GET',
      headers: getAppHeaders(getAuthorizationHeaders(token, verifier))
    }).then((response) => {
      resolveAndParseQs(response, resolve);
    }, reject);
  });
}

function accessToken(token: string, verifier: string): Promise<*> {
  return new Promise((resolve, reject) => {
    fetch(conf.discogs.oauth.access_token_url, {
      method: 'POST',
      headers: getAppHeaders(getAuthorizationHeaders(token, verifier))
    }).then((response) => {
      resolveAndParseQs(response, resolve);
    }, reject);
  });
}

function getAppHeaders(oauthHeaders) {
  return {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/vnd.discogs.v2.plaintext+json',
    'Authorization': oauthHeaders,
    'User-Agent': conf.app_user_agent
  };
}

function getSecureHeaders(oAuthObject: OAuthData) {
  const date = new Date();
  return [`OAuth oauth_consumer_key="${conf.discogs.oauth.key}"`,
    `oauth_nonce="${getNonce(date)}"`,
    `oauth_signature="${percentEncode(`${conf.discogs.oauth.secret}&${oAuthObject.oauth_token_secret}`)}"`,
    'oauth_signature_method="PLAINTEXT"',
    `oauth_timestamp="${date.getTime()}"`,
    `oauth_token="${oAuthObject.oauth_token}"`].join(', ');
}

function getInitialHeaders() {
  const date = new Date();
  return [`OAuth oauth_consumer_key="${conf.discogs.oauth.key}"`,
    `oauth_nonce="${getNonce(date)}"`,
    `oauth_signature="${percentEncode(conf.discogs.oauth.secret)}&"`,
    'oauth_signature_method="PLAINTEXT"',
    `oauth_timestamp="${date.getTime()}"`,
    `oauth_callback="${conf.oauth_callback_url}"`].join(', ');
}

function getAuthorizationHeaders(token: string, verifier: string) {
  if (!storedTokenSecret) {
    throw new Error('Token secret is null. Call initialize() before authorize().');
  }
  const date = new Date();
  return [`OAuth oauth_consumer_key="${conf.discogs.oauth.key}"`,
    `oauth_nonce="${getNonce(date)}"`,
    `oauth_token=${token}`,
    `oauth_signature="${percentEncode(`${conf.discogs.oauth.secret}&${storedTokenSecret}`)}"`,
    'oauth_signature_method="PLAINTEXT"',
    `oauth_timestamp="${date.getTime()}"`,
    `oauth_verifier="${verifier}"`].join(', ');
}

function getNonce(date) {
  return (Math.round(date.getTime() * Math.random())).toString(16);
}

function percentEncode(str) {
  return encodeURIComponent(str)
    .replace(/\!/g, "%21")
    .replace(/\*/g, "%2A")
    .replace(/\'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29");
}

function resolveAndParseQs(response, resolveFn) {
  response.text().then(text => resolveFn(qs.parse(text)));
}
