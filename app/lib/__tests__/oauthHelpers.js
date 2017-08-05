/* @flow */
import {
  getAppHeaders,
  getSecureHeaders,
  getInitialHeaders,
  getAuthorizationHeaders,
} from '../oauthHelpers';

jest.mock('../../conf', () => ({
  app_user_agent: 'FooAgent/1.0',
  discogs: {
    oauth: {
      secret: 'foo',
      key: 'bar',
      callback_url: 'http://callback-url',
    },
  },
}));

global.Date = () => ({
  getTime(): number {
    return 13234523452;
  }
});
global.Math = {
  min() {},
  max() {},
  round(x: number): number { return x; },
  random(): number {
    return 0.123456789;
  },
};

describe('app/lib/oauthHelpers', () => {  
  describe('getAppHeaders', () => {
    it('should return the app headers', () => {
      expect(getAppHeaders('sampleHeaders')).toMatchSnapshot();
    });
  });
  describe('getSecureHeaders', () => {
    it('should return the app oAuth headers', () => {
      expect(getSecureHeaders({
        oauth_token: 'oAuthTokenValue',
        oauth_token_secret: 'oAuthSecretValue',
      })).toMatchSnapshot();
    });
  });
  describe('getInitialHeaders', () => {
    it('should return the initial call headers', () => {
      expect(getInitialHeaders()).toMatchSnapshot();
    });
  });
  describe('getAuthorizationHeaders', () => {
    it('should throw an error if the stored secret is null', () => {
      expect(() => getAuthorizationHeaders('foo', 'bar')).toThrow();
    });
    it('should return the authorization headers if the param is supplied', () => {
      expect(getAuthorizationHeaders('foo', 'bar', 'baz')).toMatchSnapshot();
    });
  });
});
