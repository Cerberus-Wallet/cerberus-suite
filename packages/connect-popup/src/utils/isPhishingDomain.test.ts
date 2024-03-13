import { isPhishingDomain } from './isPhishingDomain';

describe('isPhishingDomain', () => {
    const good = ['cerberus.uraanai.com', 'connect.cerberus.uraanai.com'];

    good.forEach(domain => {
        it(`ok: ${domain}`, () => {
            expect(isPhishingDomain(domain)).toEqual(false);
        });
    });
});
