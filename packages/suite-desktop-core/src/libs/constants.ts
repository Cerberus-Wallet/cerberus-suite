import url from 'url';

import { isDevEnv } from '@suite-common/suite-utils';
import { TOR_URLS } from '@cerberus/urls';
import { isCodesignBuild } from '@cerberus/env-utils';

const getAppName = () => {
    const appName = 'Cerberus Suite';

    if (!isCodesignBuild()) {
        return `${appName} ${isDevEnv ? 'Local' : 'Dev'}`;
    }

    return appName;
};

export const APP_NAME = getAppName();

export const FILE_PROTOCOL = 'file';

export const APP_SRC = isDevEnv
    ? 'http://localhost:8001/'
    : url.format({
          pathname: 'index.html',
          protocol: FILE_PROTOCOL,
          slashes: true,
      });

// HTTP server default origins
export const HTTP_ORIGINS_DEFAULT = [
    '127.0.0.1',
    'localhost',
    'cerberus.uraanai.com',
    '*.cerberus.uraanai.com',
    '*.sldev.cz',
    TOR_URLS['cerberus.uraanai.com'],
    `*.${TOR_URLS['cerberus.uraanai.com']}`,
];
