# Environments

## Staging

Staging is available at staging-suite.cerberus.uraanai.com and is only accessible within SatoshiLabs internal IP range (office + VPN).

Before releasing publicly we deploy to so-called staging environment which should be 1:1 with production. QA tests the release there.

## Production (suite.cerberus.uraanai.com)

Stable version is hosted on suite.cerberus.uraanai.com.

| route | source            | assetPrefix |
| ----- | ----------------- | ----------- |
| /web  | @cerberus/suite-web | /web        |
