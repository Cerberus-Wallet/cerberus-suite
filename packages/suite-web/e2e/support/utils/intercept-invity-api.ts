import { fixtures } from './fixtures';

export const interceptInvityApi = () => {
    const InvityApiUrlToIntercept = 'https://exchange.trezorcheck.io';

    Object.entries(fixtures).forEach(fixtureEntry => {
        const [path, fixture] = fixtureEntry;
        cy.intercept(`${InvityApiUrlToIntercept}${path}`, {
            fixture,
        });
    });
};
