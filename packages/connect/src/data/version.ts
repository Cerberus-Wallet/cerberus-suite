export const VERSION = '9.2.0';

const versionN = VERSION.split('.').map(s => parseInt(s, 10));

export const DEFAULT_DOMAIN = `https://connect.cerberus.uraanai.com/${versionN[0]}/`;
