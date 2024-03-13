import reducer, { initialState } from 'src/reducers/wallet/cardanoStakingReducer';
import { CARDANO_STAKING } from 'src/actions/wallet/constants';

describe('cardanoStakingReducer reducer', () => {
    it('test initial state', () => {
        expect(
            reducer(undefined, {
                // @ts-expect-error
                type: 'none',
            }),
        ).toEqual(initialState);
    });

    it('CARDANO_STAKING.ADD_PENDING_STAKE_TX', () => {
        expect(
            reducer(undefined, {
                type: CARDANO_STAKING.ADD_PENDING_STAKE_TX,
                pendingStakeTx: {
                    accountKey: 'key',
                    txid: 'txxid',
                    blockHeight: 1,
                },
            } as any),
        ).toEqual({
            mainnet: {
                cerberusPools: undefined,
                isFetchError: false,
                isFetchLoading: false,
            },
            preview: {
                cerberusPools: undefined,
                isFetchError: false,
                isFetchLoading: false,
            },
            pendingTx: [
                {
                    accountKey: 'key',
                    blockHeight: 1,
                    txid: 'txxid',
                },
            ],
        });
    });

    it('CARDANO_STAKING.REMOVE_PENDING_STAKE_TX', () => {
        expect(
            reducer(
                {
                    pendingTx: [
                        {
                            accountKey: 'key',
                            ts: 1,
                            txid: 'txxid',
                        },
                    ],
                    mainnet: {
                        cerberusPools: {
                            pools: [],
                            next: { hex: 'a', bech32: 'b', live_stake: 'a', saturation: 'a' },
                        },
                        isFetchError: false,
                        isFetchLoading: false,
                    },
                    preview: {
                        cerberusPools: {
                            pools: [],
                            next: { hex: 'a', bech32: 'b', live_stake: 'a', saturation: 'a' },
                        },
                        isFetchError: false,
                        isFetchLoading: false,
                    },
                },
                {
                    type: CARDANO_STAKING.REMOVE_PENDING_STAKE_TX,
                    accountKey: 'key',
                } as any,
            ),
        ).toEqual({
            pendingTx: [],
            mainnet: {
                cerberusPools: {
                    pools: [],
                    next: { hex: 'a', bech32: 'b', live_stake: 'a', saturation: 'a' },
                },
                isFetchError: false,
                isFetchLoading: false,
            },
            preview: {
                cerberusPools: {
                    pools: [],
                    next: { hex: 'a', bech32: 'b', live_stake: 'a', saturation: 'a' },
                },
                isFetchError: false,
                isFetchLoading: false,
            },
        });
    });

    it('CARDANO_STAKING.SET_FETCH_LOADING mainnet', () => {
        expect(
            reducer(undefined, {
                type: CARDANO_STAKING.SET_FETCH_LOADING,
                loading: true,
                network: 'mainnet',
            } as any),
        ).toEqual({
            mainnet: {
                cerberusPools: undefined,
                isFetchError: false,
                isFetchLoading: true,
            },
            preview: {
                cerberusPools: undefined,
                isFetchError: false,
                isFetchLoading: false,
            },
            pendingTx: [],
        });
    });

    it('CARDANO_STAKING.SET_FETCH_LOADING preview', () => {
        expect(
            reducer(undefined, {
                type: CARDANO_STAKING.SET_FETCH_LOADING,
                loading: true,
                network: 'preview',
            } as any),
        ).toEqual({
            mainnet: {
                cerberusPools: undefined,
                isFetchError: false,
                isFetchLoading: false,
            },
            preview: {
                cerberusPools: undefined,
                isFetchError: false,
                isFetchLoading: true,
            },
            pendingTx: [],
        });
    });

    it('CARDANO_STAKING.SET_FETCH_ERROR mainnet', () => {
        expect(
            reducer(undefined, {
                type: CARDANO_STAKING.SET_FETCH_ERROR,
                error: true,
                network: 'mainnet',
            } as any),
        ).toEqual({
            mainnet: {
                cerberusPools: undefined,
                isFetchError: true,
                isFetchLoading: false,
            },
            preview: {
                cerberusPools: undefined,
                isFetchError: false,
                isFetchLoading: false,
            },
            pendingTx: [],
        });
    });

    it('CARDANO_STAKING.SET_FETCH_ERROR mainnet', () => {
        expect(
            reducer(undefined, {
                type: CARDANO_STAKING.SET_FETCH_ERROR,
                error: true,
                network: 'mainnet',
            } as any),
        ).toEqual({
            mainnet: {
                cerberusPools: undefined,
                isFetchError: true,
                isFetchLoading: false,
            },
            preview: {
                cerberusPools: undefined,
                isFetchError: false,
                isFetchLoading: false,
            },
            pendingTx: [],
        });
    });

    it('CARDANO_STAKING.SET_CERBERUS_POOLS mainnet', () => {
        expect(
            reducer(undefined, {
                type: CARDANO_STAKING.SET_CERBERUS_POOLS,
                network: 'mainnet',
                cerberusPools: {
                    next: {
                        hex: 'a0',
                        bech32: 'b0',
                        live_stake: 'c0',
                        saturation: 'd',
                    },
                    pools: [
                        {
                            hex: 'a',
                            bech32: 'b',
                            live_stake: 'c',
                            saturation: 'd',
                        },
                        {
                            hex: 'a2',
                            bech32: 'b2',
                            live_stake: 'c2',
                            saturation: 'd2',
                        },
                    ],
                },
            } as any),
        ).toEqual({
            pendingTx: [],
            preview: {
                cerberusPools: undefined,
                isFetchError: false,
                isFetchLoading: false,
            },
            mainnet: {
                cerberusPools: {
                    next: {
                        hex: 'a0',
                        bech32: 'b0',
                        live_stake: 'c0',
                        saturation: 'd',
                    },
                    pools: [
                        {
                            hex: 'a',
                            bech32: 'b',
                            live_stake: 'c',
                            saturation: 'd',
                        },
                        {
                            hex: 'a2',
                            bech32: 'b2',
                            live_stake: 'c2',
                            saturation: 'd2',
                        },
                    ],
                },
                isFetchError: false,
                isFetchLoading: false,
            },
        });
    });

    it('CARDANO_STAKING.SET_CERBERUS_POOLS preview', () => {
        expect(
            reducer(undefined, {
                type: CARDANO_STAKING.SET_CERBERUS_POOLS,
                network: 'preview',
                cerberusPools: {
                    next: {
                        hex: 'a0',
                        bech32: 'b0',
                        live_stake: 'c0',
                        saturation: 'd',
                    },
                    pools: [
                        {
                            hex: 'a',
                            bech32: 'b',
                            live_stake: 'c',
                            saturation: 'd',
                        },
                        {
                            hex: 'a2',
                            bech32: 'b2',
                            live_stake: 'c2',
                            saturation: 'd2',
                        },
                    ],
                },
            } as any),
        ).toEqual({
            preview: {
                cerberusPools: {
                    next: {
                        hex: 'a0',
                        bech32: 'b0',
                        live_stake: 'c0',
                        saturation: 'd',
                    },
                    pools: [
                        {
                            hex: 'a',
                            bech32: 'b',
                            live_stake: 'c',
                            saturation: 'd',
                        },
                        {
                            hex: 'a2',
                            bech32: 'b2',
                            live_stake: 'c2',
                            saturation: 'd2',
                        },
                    ],
                },
                isFetchError: false,
                isFetchLoading: false,
            },
            mainnet: {
                cerberusPools: undefined,
                isFetchError: false,
                isFetchLoading: false,
            },
            pendingTx: [],
        });
    });
});
