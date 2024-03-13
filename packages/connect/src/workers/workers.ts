import type { BaseWorker } from '@cerberus/blockchain-link/lib/workers/baseWorker';

type WorkerAsyncImporter = () => Promise<BaseWorker<unknown>>;

const BlockbookWorker: WorkerAsyncImporter = () =>
    import(
        /* webpackChunkName: "blockbook-worker" */ '@cerberus/blockchain-link/lib/workers/blockbook'
    ).then(w => w.default());
const RippleWorker: WorkerAsyncImporter = () =>
    import(
        /* webpackChunkName: "ripple-worker" */ '@cerberus/blockchain-link/lib/workers/ripple'
    ).then(w => w.default());
const BlockfrostWorker: WorkerAsyncImporter = () =>
    import(
        /* webpackChunkName: "blockfrost-worker" */ '@cerberus/blockchain-link/lib/workers/blockfrost'
    ).then(w => w.default());
const ElectrumWorker: WorkerAsyncImporter = () =>
    import(
        /* webpackChunkName: "electrum-worker" */ '@cerberus/blockchain-link/lib/workers/electrum'
    ).then(w => w.default());
const SolanaWorker: WorkerAsyncImporter = () =>
    import(
        /* webpackChunkName: "solana-worker" */ '@cerberus/blockchain-link/lib/workers/solana'
    ).then(w => w.default());

export { BlockbookWorker, RippleWorker, BlockfrostWorker, ElectrumWorker, SolanaWorker };
