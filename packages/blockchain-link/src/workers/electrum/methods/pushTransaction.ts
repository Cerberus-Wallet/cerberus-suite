import { Api } from '../utils';
import type { PushTransaction as Req } from '@cerberus/blockchain-link-types/lib/messages';
import type { PushTransaction as Res } from '@cerberus/blockchain-link-types/lib/responses';

const pushTransaction: Api<Req, Res> = async (client, payload) => {
    const res = await client.request('blockchain.transaction.broadcast', payload);

    return res;
};

export default pushTransaction;
