// origin: https://github.com/trezor/connect/blob/develop/src/js/data/CoinInfo.js

import { getBitcoinFeeLevels, getEthereumFeeLevels, getMiscFeeLevels } from './defaultFeeLevels';
import { ERRORS } from '../constants';
import { toHardened, fromHardened } from '../utils/pathUtils';
import type {
    CoinInfo,
    BitcoinNetworkInfo,
    EthereumNetworkInfo,
    MiscNetworkInfo,
} from '../types/coinInfo';
import { cloneObject } from '@trezor/utils';
import {
    getEthereumDefinitions,
    decodeEthereumDefinition,
    ethereumNetworkInfoFromDefinition,
} from './ethereumDefinitions';

const bitcoinNetworks: BitcoinNetworkInfo[] = [];
const ethereumNetworks: EthereumNetworkInfo[] = [];
const miscNetworks: MiscNetworkInfo[] = [];

export const getBitcoinNetwork = (pathOrName: number[] | string) => {
    const networks = cloneObject(bitcoinNetworks);
    if (typeof pathOrName === 'string') {
        const name = pathOrName.toLowerCase();
        return networks.find(
            n =>
                n.name.toLowerCase() === name ||
                n.shortcut.toLowerCase() === name ||
                n.label.toLowerCase() === name,
        );
    }
    const slip44 = fromHardened(pathOrName[1]);
    return networks.find(n => n.slip44 === slip44);
};

export const getEthereumNetworkFromCoinsJSON = (pathOrName: number[] | string) => {
    const networks = cloneObject(ethereumNetworks);
    let network;

    // find static network by path or name
    if (typeof pathOrName === 'string') {
        const name = pathOrName.toLowerCase();
        network = networks.find(
            n => n.name.toLowerCase() === name || n.shortcut.toLowerCase() === name,
        );
    }
    if (network) {
        return network;
    }

    // find network by slip44
    const slip44 = typeof pathOrName[1] === 'number' ? fromHardened(pathOrName[1]) : undefined;
    network = networks.find(n => n.slip44 === slip44);

    if (network) {
        return network;
    }
};

export const getEthereumNetwork = async (pathOrName: number[] | string) => {
    let network = getEthereumNetworkFromCoinsJSON(pathOrName);

    if (network) {
        return network;
    }

    const slip44 = typeof pathOrName[1] === 'number' ? fromHardened(pathOrName[1]) : undefined;

    // find network definition on data.trezor.io

    const definitions = await getEthereumDefinitions({
        slip44,
    });

    const decoded = decodeEthereumDefinition(definitions);
    if (decoded.network) {
        network = {
            ...ethereumNetworkInfoFromDefinition(decoded.network),
            encoded_network: definitions.encoded_network,
        };
    }

    if (!network) {
        // todo: should it throw on this level?
        throw ERRORS.TypedError('Method_UnknownCoin');
    }

    // cache decoded network locally in networks list so that it does not have to be fetched again next time
    if (!ethereumNetworks.some(n => n.chainId === network!.chainId)) {
        ethereumNetworks.push(network);
    }

    return network;
};

export const getMiscNetwork = (pathOrName: number[] | string) => {
    const networks = cloneObject(miscNetworks);
    if (typeof pathOrName === 'string') {
        const name = pathOrName.toLowerCase();
        return networks.find(
            n => n.name.toLowerCase() === name || n.shortcut.toLowerCase() === name,
        );
    }
    const slip44 = fromHardened(pathOrName[1]);
    return networks.find(n => n.slip44 === slip44);
};

/*
 * Bitcoin networks
 */

export const getSegwitNetwork = (coin: BitcoinNetworkInfo) => {
    if (coin.segwit && typeof coin.xPubMagicSegwit === 'number') {
        return {
            ...coin.network,
            bip32: {
                ...coin.network.bip32,
                public: coin.xPubMagicSegwit,
            },
        };
    }
    return null;
};

export const getBech32Network = (coin: BitcoinNetworkInfo) => {
    if (coin.segwit && typeof coin.xPubMagicSegwitNative === 'number') {
        return {
            ...coin.network,
            bip32: {
                ...coin.network.bip32,
                public: coin.xPubMagicSegwitNative,
            },
        };
    }
    return null;
};

// fix coinInfo network values from path (segwit/legacy)
export const fixCoinInfoNetwork = (ci: BitcoinNetworkInfo, path: number[]) => {
    const coinInfo = cloneObject(ci);
    if (path[0] === toHardened(84)) {
        const bech32Network = getBech32Network(coinInfo);
        if (bech32Network) {
            coinInfo.network = bech32Network;
        }
    } else if (path[0] === toHardened(49)) {
        const segwitNetwork = getSegwitNetwork(coinInfo);
        if (segwitNetwork) {
            coinInfo.network = segwitNetwork;
        }
    } else {
        coinInfo.segwit = false;
    }
    return coinInfo;
};

// TODO: https://github.com/trezor/trezor-suite/issues/4886
const detectBtcVersion = (data: { subversion?: string }) => {
    if (data.subversion == null) {
        return 'btc';
    }
    if (data.subversion.startsWith('/Bitcoin ABC')) {
        return 'bch';
    }
    if (data.subversion.startsWith('/Bitcoin Cash')) {
        return 'bch';
    }
    if (data.subversion.startsWith('/Bitcoin Gold')) {
        return 'btg';
    }
    return 'btc';
};

// TODO: https://github.com/trezor/trezor-suite/issues/4886
export const getCoinInfoByHash = (hash: string, networkInfo: any) => {
    const networks = cloneObject(bitcoinNetworks);
    const result = networks.find(
        info => hash.toLowerCase() === info.hashGenesisBlock.toLowerCase(),
    );
    if (!result) {
        throw ERRORS.TypedError(
            'Method_UnknownCoin',
            `Coin info not found for hash: ${hash} ${networkInfo.hashGenesisBlock}`,
        );
    }

    if (result.isBitcoin) {
        const btcVersion = detectBtcVersion(networkInfo);
        let fork: BitcoinNetworkInfo | undefined;
        if (btcVersion === 'bch') {
            fork = networks.find(info => info.name === 'Bcash');
        } else if (btcVersion === 'btg') {
            fork = networks.find(info => info.name === 'Bgold');
        }
        if (fork) {
            return fork;
        }
        throw ERRORS.TypedError(
            'Method_UnknownCoin',
            `Coin info not found for hash: ${hash} ${networkInfo.hashGenesisBlock} BTC version:${btcVersion}`,
        );
    }
    return result;
};

export const getCoinInfo = async (currency: string) =>
    getBitcoinNetwork(currency) || getEthereumNetwork(currency) || getMiscNetwork(currency);

export const getCoinName = (path: number[]) => {
    const slip44 = fromHardened(path[1]);
    const network = ethereumNetworks.find(n => n.slip44 === slip44);
    return network ? network.name : 'Unknown coin';
};

const parseBitcoinNetworksJson = (json: any, blockchainLink?: any) => {
    Object.keys(json).forEach(key => {
        const coin = json[key];
        const shortcut = coin.coin_shortcut;
        const isBitcoin = shortcut === 'BTC' || shortcut === 'TEST';

        const network = {
            messagePrefix: coin.signed_message_header,
            bech32: coin.bech32_prefix,
            bip32: {
                public: coin.xpub_magic,
                private: coin.xprv_magic,
            },
            pubKeyHash: coin.address_type,
            scriptHash: coin.address_type_p2sh,
            forkId: coin.fork_id,
            wif: 0, // doesn't matter, for type correctness
        };

        bitcoinNetworks.push({
            type: 'bitcoin',
            // address_type in Network
            // address_type_p2sh in Network
            // bech32_prefix in Network
            // consensus_branch_id in Network
            // bip115: not used
            // bitcore: not used,
            // blockbook: not used,
            cashAddrPrefix: coin.cashaddr_prefix,
            label: coin.coin_label,
            name: coin.coin_name,
            shortcut,
            // cooldown not used
            curveName: coin.curve_name,
            // decred not used
            forceBip143: coin.force_bip143,
            // forkid in Network
            // github not used
            hashGenesisBlock: coin.hash_genesis_block,
            // key not used
            // maintainer not used
            maxAddressLength: coin.max_address_length,
            maxFeeSatoshiKb: coin.maxfee_kb,
            minAddressLength: coin.min_address_length,
            minFeeSatoshiKb: coin.minfee_kb,
            // name: same as coin_label
            segwit: coin.segwit,
            // signed_message_header in Network
            slip44: coin.slip44,
            support: coin.support,
            // uri_prefix not used
            // version_group_id not used
            // website not used
            // xprv_magic in Network
            xPubMagic: coin.xpub_magic,
            xPubMagicSegwitNative: coin.xpub_magic_segwit_native,
            xPubMagicSegwit: coin.xpub_magic_segwit_p2sh,
            taproot: coin.taproot,

            // custom
            network, // bitcoinjs network
            isBitcoin,

            decimals: coin.decimals,
            ...getBitcoinFeeLevels(coin),
            blockchainLink: blockchainLink?.[shortcut],
        });
    });
};

export const ethereumNetworkInfoBase = {
    type: 'ethereum' as const,
    decimals: 16,
    ...getEthereumFeeLevels(),
};

const parseEthereumNetworksJson = (json: any, blockchainLink?: any) => {
    Object.keys(json).forEach(key => {
        const network = json[key];

        ethereumNetworks.push({
            ...ethereumNetworkInfoBase,
            chainId: network.chain_id,
            label: network.name,
            name: network.name,
            shortcut: network.shortcut,
            slip44: network.slip44,
            support: network.support,
            blockchainLink: blockchainLink?.[network.shortcut],
        });
    });
};

const parseMiscNetworksJSON = (json: any, type: 'misc' | 'nem', blockchainLink: any) => {
    Object.keys(json).forEach(key => {
        const network = json[key];
        miscNetworks.push({
            type: type || 'misc',
            curve: network.curve,
            label: network.name,
            name: network.name,
            shortcut: network.shortcut,
            slip44: network.slip44,
            support: network.support,
            decimals: network.decimals,
            ...getMiscFeeLevels(network),
            blockchainLink: blockchainLink?.[network.shortcut],
        });
    });
};

export const parseCoinsJson = (json: any, blockchainLink: any) => {
    Object.keys(json).forEach(key => {
        switch (key) {
            case 'bitcoin':
                return parseBitcoinNetworksJson(json[key], blockchainLink);
            case 'eth':
                return parseEthereumNetworksJson(json[key], blockchainLink);
            case 'misc':
                return parseMiscNetworksJSON(json[key], 'misc', blockchainLink);
            case 'nem':
                return parseMiscNetworksJSON(json[key], 'nem', blockchainLink);
            // no default
        }
    });
};

export const getUniqueNetworks = (networks: (CoinInfo | undefined)[]) =>
    networks.reduce((result: CoinInfo[], info?: CoinInfo) => {
        if (!info || result.find(i => i.shortcut === info.shortcut)) return result;
        return result.concat(info);
    }, []);

export const getAllNetworks = () => [...bitcoinNetworks, ...ethereumNetworks, ...miscNetworks];
