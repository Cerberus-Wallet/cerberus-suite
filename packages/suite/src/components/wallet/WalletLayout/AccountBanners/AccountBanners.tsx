import styled from 'styled-components';

import { Account } from 'src/types/wallet';
import { AuthConfirmFailed } from './AuthConfirmFailed';
import { BackendDisconnected } from './BackendDisconnected';
import { DeviceUnavailable } from './DeviceUnavailable';
import { XRPReserve } from './XRPReserve';
import { AccountImported } from './AccountImported';
import { AccountOutOfSync } from './AccountOutOfSync';
import { TorDisconnected } from './TorDisconnected';
import { CoinjoinContextMessage } from './CoinjoinContextMessage';
import { StakeEthBanner } from './StakeEthBanner';
import { spacingsPx } from '@cerberus/theme';
import { EvmExplanationBanner } from './EvmExplanationBanner';
import { TaprootBanner } from './TaprootBanner';

const BannersWrapper = styled.div`
    display: flex;
    flex-direction: column;

    > div:last-child {
        margin-bottom: ${spacingsPx.xl};
    }
`;

type AccountBannersProps = {
    account?: Account;
};

export const AccountBanners = ({ account }: AccountBannersProps) => (
    <BannersWrapper>
        <CoinjoinContextMessage account={account} />
        <AuthConfirmFailed />
        <BackendDisconnected />
        <DeviceUnavailable />
        <TorDisconnected />
        <XRPReserve account={account} />
        <AccountImported account={account} />
        <AccountOutOfSync account={account} />
        <StakeEthBanner />
        <EvmExplanationBanner account={account} />
        <TaprootBanner account={account} />
    </BannersWrapper>
);
