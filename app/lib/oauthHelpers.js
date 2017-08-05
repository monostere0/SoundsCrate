/* @flow */
import type { OAuthData, AppHeaders } from './oauth';
import conf from '../conf';

export function getAuthorizationHeaders(
  token: string,
  verifier: string,
  storedTokenSecret?: ?string,
): string {
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

export function getAppHeaders(oauthHeaders: string): AppHeaders {
  return {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/vnd.discogs.v2.plaintext+json',
    'Authorization': oauthHeaders,
    'User-Agent': conf.app_user_agent
  };
}

export function getSecureHeaders(oAuthObject: OAuthData): string {
  const date = new Date();
  return [`OAuth oauth_consumer_key="${conf.discogs.oauth.key}"`,
    `oauth_nonce="${getNonce(date)}"`,
    `oauth_signature="${percentEncode(`${conf.discogs.oauth.secret}&${oAuthObject.oauth_token_secret}`)}"`,
    'oauth_signature_method="PLAINTEXT"',
    `oauth_timestamp="${date.getTime()}"`,
    `oauth_token="${oAuthObject.oauth_token}"`].join(', ');
}

export function getInitialHeaders(): string {
  const date = new Date();
  return [`OAuth oauth_consumer_key="${conf.discogs.oauth.key}"`,
    `oauth_nonce="${getNonce(date)}"`,
    `oauth_signature="${percentEncode(conf.discogs.oauth.secret)}&"`,
    'oauth_signature_method="PLAINTEXT"',
    `oauth_timestamp="${date.getTime()}"`,
    `oauth_callback="${conf.discogs.oauth.callback_url}"`].join(', ');
}

function getNonce(date: Date): string {
  return (Math.round(date.getTime() * Math.random())).toString(16);
}

function percentEncode(str: string): string {
  return encodeURIComponent(str)
    .replace(/\!/g, "%21")
    .replace(/\*/g, "%2A")
    .replace(/\'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29");
}
