import styled from 'styled-components';

import { Button } from '@cerberus/components';

import * as cerberusConnectActions from '../actions/cerberusConnectActions';
import { useSelector, useActions } from '../hooks';

import { Row } from './fields/Row';
import { getField } from './Method';
import { Field, FieldWithBundle } from '../types';

const SettingsContent = styled.section`
    flex: 1;
    padding: 10px 20px;
    display: flex;
    flex-direction: column;
`;

const ConfirmationMessage = styled.div`
    margin-top: 20px;
    color: green;
    font-weight: bold;
`;

export const Settings = () => {
    const connectOptions = useSelector(state => ({
        trustedHost: state.connect?.options?.trustedHost,
        connectSrc: state.connect?.options?.connectSrc,
    }));

    const isHandshakeConfirmed = useSelector(state => state.connect?.isHandshakeConfirmed || false);
    const actions = useActions({
        onSubmitInit: cerberusConnectActions.onSubmitInit,
        onFieldChange: cerberusConnectActions.onConnectOptionChange,
    });

    const submitButton = 'Init Connect';
    const fields: (Field<any> | FieldWithBundle<any>)[] = [
        {
            name: 'trustedHost',
            type: 'checkbox',
            key: 'trustedHost',
            value: connectOptions?.trustedHost || false,
        },
        {
            name: 'connectSrc',
            type: 'input',
            key: 'connectSrc',
            value: connectOptions?.connectSrc || '',
        },
    ];

    return (
        <SettingsContent>
            {fields.map(field => getField(field, { actions }))}
            <Row>
                <Button onClick={actions.onSubmitInit} data-test="@submit-button">
                    {submitButton}
                </Button>
            </Row>
            {isHandshakeConfirmed && (
                <ConfirmationMessage data-test="@settings/handshake-confirmed">
                    Handshake confirmed!
                </ConfirmationMessage>
            )}
        </SettingsContent>
    );
};
