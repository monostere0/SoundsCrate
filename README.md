# SoundsCrate

### A React native app for viewing your discogs.com collection

This app allows you to authenticate to discogs.com and see your records collection in a neat way,
just like you'd browse them through your crates :)

#### Optimised for both iOS and Android

#### Uses
- React Native
- JS
- Flow
- Jest
- Discogs API (incl. custom RN wrapper for OAuth flow)

#### Preview
![alt text](preview.gif)


#### How to start the app
- Check out the repo
- `yarn` or `npm i`
- Go to discogs.com, the settings page > developers and create a new app (after you have logged in). The "Callback URL" field should be set to `soundscrate://`. After you create the application, you should see a page which contains the "Consumer Key" and "Consumer Secret" tokens. Go ahead and create an `.env` file in the root of the project which should look like this:

  ```
  S_CONSUMER_KEY=Your Discogs Consumer Key
  S_CONSUMER_SECRET=Your Discogs Consumer Secret
  ```

- Make sure you have react native cli installed globally, and do `react-native run-ios` or `react-native run-android` in the root directory of the project.
- Happy browsing!
