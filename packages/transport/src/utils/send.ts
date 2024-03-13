// Logic of sending data to cerberus
//
// Logic of "call" is broken to two parts - sending and receiving
import { Root } from 'protobufjs/light';
import { encode as encodeProtobuf, createMessageFromName } from '@cerberus/protobuf';
import { TransportProtocolEncode } from '@cerberus/protocol';

export const buildBuffers = (
    messages: Root,
    name: string,
    data: Record<string, unknown>,
    encoder: TransportProtocolEncode,
) => {
    const { Message, messageType } = createMessageFromName(messages, name);
    const buffer = encodeProtobuf(Message, data);

    return encoder(buffer, {
        messageType,
    });
};
