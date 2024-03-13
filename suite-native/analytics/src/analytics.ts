import { isDebugEnv } from '@suite-native/config';
import { getSuiteVersion } from '@cerberus/env-utils';
import { Analytics } from '@cerberus/analytics';

import { SuiteNativeAnalyticsEvent } from './events';

export const analytics = new Analytics<SuiteNativeAnalyticsEvent>({
    version: getSuiteVersion(),
    app: 'suite',
});

if (isDebugEnv()) {
    // Do not send analytics in development
    analytics.report = () => {};
}
