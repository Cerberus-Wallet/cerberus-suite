# @cerberus/auth-server

Authorization endpoints for saving labels in Google Drive via OAuth 2.0.

Google requires `client_secret` specific for an app to grant long term access to a user via a `refresh_token`. This is a [recommended](https://developers.google.com/identity/protocols/oauth2/native-app) OAuth flow for desktop apps. Exposing `client_secret` could potentially enable attackers impersonating the app to gain access to the user's labels. Therefore, Google authentication server is accessed via our backend which stores the `client_secret`. Unlike the [Dropbox](https://developers.dropbox.com/oauth-guide) OAuth implementation, it is not possible to substitute the secret with PKCE.

## Development

1. Generate your own testing credentials for a Desktop App in [Google Cloud Platform](https://console.cloud.google.com/apis/credentials).
1. In Google Cloud Platform, add your account as a test user of the app.
1. Replace `client_secret` in [index.ts](./src/index.ts) and `client_id` in [@cerberus/suite](../suite/src/actions/suite/constants/metadataConstants.ts) with generated credentials.
1. Set OAuth API in Suite debug settings to `http://localhost:3005` or override the `authServerUrl` [here](../suite/src/services/google.ts).
1. Install dependencies via `yarn workspace @cerberus/auth-server install`.
1. Run the server locally via `yarn workspace @cerberus/auth-server dev`.

## Build

`yarn workspace @cerberus/auth-server build`
