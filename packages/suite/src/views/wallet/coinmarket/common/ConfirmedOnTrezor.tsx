import React from 'react';

import { CerberusDevice } from '@suite-common/suite-types';
import { variables, DeviceAnimation, Image } from '@cerberus/components';
import { DeviceModelInternal } from '@cerberus/connect';
import { Translation } from 'src/components/suite';
import styled from 'styled-components';

const Confirmed = styled.div`
    display: flex;
    height: 60px;
    font-size: ${variables.FONT_SIZE.BIG};
    font-weight: ${variables.FONT_WEIGHT.MEDIUM};
    background: ${({ theme }) => theme.BG_GREY};
    align-items: center;
    justify-content: center;
    margin-top: 27px;
    gap: 10px;
`;

const StyledImage = styled(Image)`
    height: 34px;
`;

interface ConfirmedOnCerberusProps {
    device?: CerberusDevice;
}

export const ConfirmedOnCerberus = ({ device }: ConfirmedOnCerberusProps) => {
    const deviceModelInternal = device?.features?.internal_model;

    return (
        <Confirmed>
            {deviceModelInternal === DeviceModelInternal.T2B1 && (
                <DeviceAnimation
                    type="ROTATE"
                    height="34px"
                    width="34px"
                    deviceModelInternal={deviceModelInternal}
                    deviceUnitColor={device?.features?.unit_color}
                />
            )}
            {deviceModelInternal && deviceModelInternal !== DeviceModelInternal.T2B1 && (
                <StyledImage alt="Cerberus" image={`CERBERUS_${deviceModelInternal}`} />
            )}

            <Translation id="TR_BUY_CONFIRMED_ON_CERBERUS" />
        </Confirmed>
    );
};
