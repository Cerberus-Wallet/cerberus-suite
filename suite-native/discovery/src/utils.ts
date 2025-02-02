import { A, G, pipe } from '@mobily/ts-belt';

import { DiscoveryItem } from '@suite-common/wallet-types';
import CerberusConnect from '@cerberus/connect';

import { DiscoveryDescriptorItem } from './types';

export const fetchBundleDescriptors = async (bundle: DiscoveryItem[]) => {
    const { success, payload } = await CerberusConnect.getAccountDescriptor({
        bundle,
        skipFinalReload: true,
    });

    if (success && payload)
        return pipe(
            payload,
            A.filter(G.isNotNullable),
            A.map(bundleItem => bundleItem.descriptor),
            A.zipWith(bundle, (descriptor, bundleItem) => ({ ...bundleItem, descriptor })),
        ) as DiscoveryDescriptorItem[];

    return [];
};
