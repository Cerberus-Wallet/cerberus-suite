import { getFirmwareVersion } from '@cerberus/device-utils';

import {
    getCommitHash,
    getScreenHeight,
    getScreenWidth,
    getSuiteVersion,
    getUserAgent,
    isDesktop,
} from '@cerberus/env-utils';
import type { CerberusDevice } from 'src/types/suite';
import type { TransportInfo } from '@cerberus/connect';
import { GITHUB_REPO_URL } from '@cerberus/urls';

type DebugInfo = {
    device?: CerberusDevice;
    transport?: Partial<TransportInfo>;
};

const getDeviceInfo = (device?: CerberusDevice) => {
    if (!device?.features) {
        return '';
    }

    return `Cerberus ${device.features.internal_model} ${getFirmwareVersion(device)} ${
        device.firmwareType
    } (revision ${device.features.revision})`;
};

const getSuiteInfo = () =>
    `${isDesktop() ? 'desktop' : 'web'} ${getSuiteVersion()} (${getCommitHash()})`;

const getTransportInfo = (transport?: Partial<TransportInfo>) => {
    if (!transport?.type) {
        return 'N/A';
    }

    return transport?.type === 'BridgeTransport'
        ? `${transport.type} ${transport.version}`
        : transport.type;
};

export const openGithubIssue = ({ device, transport }: DebugInfo) => {
    const url = new URL(`${GITHUB_REPO_URL}/issues/new`);

    const body = `
**Describe the bug**
A clear and concise description of what the bug is.

**Steps to reproduce:**
1. a
2. b
3. c

**Info:**
 - Suite version: ${getSuiteInfo()}
 - Browser: ${getUserAgent()}
 - OS: ${navigator.platform}
 - Screen: ${getScreenWidth()}x${getScreenHeight()}
 - Device: ${getDeviceInfo(device)}
 - Transport: ${getTransportInfo(transport)}

**Expected result:**
A clear and concise description of what you expected to happen.

**Actual result:**
A clear and concise description of what actually happens.

**Screenshots:**
Insert here.

**Note(s):**
Add any other context about the problem here.
`;

    url.searchParams.set('body', body);

    window.open(url.toString());
};

export const getReleaseUrl = (version: string) => `${GITHUB_REPO_URL}/releases/tag/v${version}`;
