/* flow */
import {
  AsyncStorage,
  Linking
} from 'react-native';
import { secureFetch } from '../oauth';

jest.mock('react-native', () => ({
  __esModule: true,
  AsyncStorage: {
    setItem: jest.fn(() => Promise.resolve()),
    getItem: jest.fn(value => Promise.resolve(value))
  },
  Linking: {
    addEventListener: jest.fn((event, fn) => {
      global.setTimeout(() => fn({url:'oauth_token_secret=foo&oauth_token=bar'}));
    }),
    removeEventListener: jest.fn(),
    canOpenURL: jest.fn(() => Promise.resolve()),
    openURL: jest.fn(),
  },
}));

beforeEach(() => {
  global.fetch = () => {
    const oauthResp = 'oauth_token_secret=foo&oauth_token=bar';
    return Promise.resolve({
      text: () => Promise.resolve(oauthResp)
    });
  };
});

describe('app/lib/oauth', () => {
  it('should try to do an oAuthFetch if the token is set', async () => {
    AsyncStorage.getItem.mockImplementation(() => { 
      return Promise.resolve('{ "oauth_token": "foo", "oauth_token_secret": "bar" }');
    });
    await secureFetch('http://www.foo.bar', {});
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@SoundsCrater:oauthToken');
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    expect(Linking.addEventListener).not.toHaveBeenCalled();
    expect(Linking.canOpenURL).not.toHaveBeenCalled();
    expect(Linking.openURL).not.toHaveBeenCalled();
  });
  xit('should start the oauth flow if the token is not set', async () => {
    AsyncStorage.getItem.mockImplementation(() => { 
      return Promise.resolve('{}');
    });
    await secureFetch('http://www.foo.bar', {});
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@SoundsCrater:oauthToken');
    expect(AsyncStorage.setItem).toHaveBeenCalled();
    expect(Linking.addEventListener).toHaveBeenCalled();
    expect(Linking.canOpenURL).toHaveBeenCalled();
    expect(Linking.openURL).toHaveBeenCalled();
  });
});
