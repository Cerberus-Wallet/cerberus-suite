import { Optional, Kind, TSchema } from '@sinclair/typebox';

import { initialState, prepareBundle, setAffectedValues, updateParams } from './methodCommon';

// Convert TypeBox schema to our fields
const schemaToFields = (schema: TSchema) => {
    if (schema[Kind] === 'Object') {
        return Object.keys(schema.properties).flatMap(key => {
            const field = schema.properties[key];
            /* if (field[Kind] === 'Object') {
                return [
                    {
                        name: key,
                        label: key,
                        type: 'json',
                        value: undefined,
                    },
                ];
            } */

            return schemaToFields(field).map(field => {
                // TODO better handle optional parent
                const optional = field.optional || schema[Optional] === 'Optional';

                return {
                    ...field,
                    name: [key, field.name].filter(v => v).join('.'),
                    items: optional ? [] : field.items,
                    optional,
                };
            });
        });
    } else if (schema[Kind] === 'Array') {
        const fields = schemaToFields(schema.items);

        return [
            {
                name: '',
                type: 'array',
                batch: [
                    {
                        type: '',
                        fields,
                    },
                ],
                items: schema[Optional] === 'Optional' ? [] : [fields],
            },
        ];
    } else if (schema[Kind] === 'Intersect') {
        return schema.allOf?.flatMap(schemaToFields);
    } else if (schema[Kind] === 'Union') {
        const onlyLiterals = schema.anyOf?.every(s => s[Kind] === 'Literal');
        if (onlyLiterals) {
            const filtered = schema.anyOf?.filter((s, i) => s.const !== i.toString());
            const options = filtered.length > 0 ? filtered : schema.anyOf;

            return [
                {
                    type: 'select',
                    value: schema.default,
                    optional: schema[Optional] === 'Optional',
                    data: options.map(s => ({ label: s.const, value: s.const })),
                },
            ];
        }

        if (schema.anyOf?.length > 0) {
            // TODO complex union handling - currently only first option is used
            return schemaToFields(schema.anyOf[0]).map(field => ({
                ...field,
                optional: field.optional || schema[Optional] === 'Optional',
                value: field.value ?? schema.default,
            }));
        } else {
            return [];
        }
    }

    const typeMap: Record<string, string> = {
        String: 'input',
        Number: 'number',
        Uint: 'number',
        Boolean: 'checkbox',
    };

    return [
        {
            originalType: schema[Kind],
            type: typeMap[schema[Kind]] ?? 'input',
            value: schema.default,
            optional: schema[Optional] === 'Optional',
        },
    ];
};

// Get method state
export const getMethodState = (methodConfig?: any) => {
    if (!methodConfig) return initialState;

    // clone object
    const state = {
        ...JSON.parse(JSON.stringify(methodConfig)),
        // ...method,
    };

    // set default values
    state.fields = state.fields.map(f => setAffectedValues(state, prepareBundle(f)));

    console.log('state', state);

    // set method params
    return updateParams(state);
};

// Get method state from TypeBox schema
export const getMethodStateFromSchema = (schema: TSchema) => {
    return getMethodState({
        name: 'method',
        fields: schemaToFields(schema),
        submitButton: 'Submit',
    });
};
