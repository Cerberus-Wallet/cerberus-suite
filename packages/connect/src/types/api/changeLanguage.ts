import { Type, Static } from '@cerberus/schema-utils';
import type { Params, Response } from '../params';
import { PROTO } from '../../constants';

export type ChangeLanguage = Static<typeof ChangeLanguage>;

export const ChangeLanguage = Type.Union([
    Type.Object({
        binary: Type.Optional(Type.Undefined()),
        language: Type.String(),
        baseUrl: Type.Optional(Type.String()),
    }),
    Type.Object({
        binary: Type.ArrayBuffer(),
        language: Type.Optional(Type.Undefined()),
        baseUrl: Type.Optional(Type.Undefined()),
    }),
]);

export declare function changeLanguage(params: Params<ChangeLanguage>): Response<PROTO.Success>;
