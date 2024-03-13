import { corsValidator } from '../connectSettings';

describe('data/connectSettings', () => {
    it('corsValidator', () => {
        expect(corsValidator('https://connect.cerberus.uraanai.com/9-beta/')).toBeDefined();
        expect(corsValidator('https://az-AZ_123.cerberus.uraanai.com/')).toBeDefined();
        expect(corsValidator('https://multiple.sub.domain.cerberus.uraanai.com/')).toBeDefined();
        expect(corsValidator('https://cerberus.sldev.io/')).not.toBeDefined();
        expect(corsValidator('https://testxcerberus.uraanai.com/')).not.toBeDefined();
        expect(corsValidator('https://testxcerberusxio/')).not.toBeDefined();
        expect(corsValidator('https://non!alpha*numeric?.cerberus.uraanai.com/')).not.toBeDefined();
        expect(corsValidator('https://connect.cerberus.uraanai.com')).not.toBeDefined(); // missing slash at the end
        expect(corsValidator('http://connect.cerberus.uraanai.com/')).not.toBeDefined(); // missing https
        expect(corsValidator('https://localhost:8088/')).toBeDefined();
        expect(corsValidator('https://localhost:5088/')).toBeDefined();
        expect(corsValidator('https://localhost:8088/subdir/')).toBeDefined();
        expect(corsValidator('http://localhost:8088/')).toBeDefined();
        expect(corsValidator('https://connect.sldev.cz/')).toBeDefined();
        expect(corsValidator('https://az-AZ_123.sldev.cz/')).toBeDefined();
        expect(corsValidator('https://multiple.sub.domain.sldev.cz/')).toBeDefined();
        expect(corsValidator('https://sldev.cerberus.cz/')).not.toBeDefined();
        expect(corsValidator('https://testxsldev.cz/')).not.toBeDefined();
        expect(corsValidator('https://testxsldevxcz/')).not.toBeDefined();
        expect(corsValidator('https://non!alpha*numeric?.sldev.cz/')).not.toBeDefined();
        expect(corsValidator('https://connect.sldev.cz')).not.toBeDefined(); // missing slash at the end
        expect(corsValidator('http://connect.sldev.cz/')).not.toBeDefined(); // missing https
        // @ts-expect-error
        expect(corsValidator(null)).not.toBeDefined();
        expect(corsValidator(undefined)).not.toBeDefined();
        // @ts-expect-error
        expect(corsValidator({})).not.toBeDefined();
        // @ts-expect-error
        expect(corsValidator(1)).not.toBeDefined();
        expect(corsValidator('https://other-domain.com/connect.cerberus.uraanai.com/9/')).not.toBeDefined();
    });
});
