import { runCLI } from 'jest';

import { CerberusUserEnvLink } from '@cerberus/cerberus-user-env-link';

import argv from './jest.config';

(async () => {
    // Before actual tests start, establish connection with cerberus-user-env
    await CerberusUserEnvLink.connect();

    // @ts-expect-error
    argv.runInBand = true;

    // @ts-expect-error
    const { results } = await runCLI(argv, [__dirname]);

    process.exit(results.numFailedTests);
})();
