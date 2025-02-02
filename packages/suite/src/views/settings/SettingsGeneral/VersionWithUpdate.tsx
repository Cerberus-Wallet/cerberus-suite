import { isDevEnv } from '@suite-common/suite-utils';
import { desktopApi } from '@cerberus/suite-desktop-api';

import { installUpdate, setUpdateWindow } from 'src/actions/suite/desktopUpdateActions';
import {
    ActionButton,
    ActionColumn,
    SectionItem,
    TextColumn,
    Translation,
    CerberusLink,
} from 'src/components/suite';
import { useDispatch, useSelector } from 'src/hooks/suite';
import { UpdateState } from 'src/reducers/suite/desktopUpdateReducer';
import { useAnchor } from 'src/hooks/suite/useAnchor';
import { SettingsAnchor } from 'src/constants/suite/anchors';

import { Button } from '@cerberus/components';
import { getReleaseUrl } from 'src/services/github';

const getUpdateStateMessage = (state: UpdateState) => {
    switch (state) {
        case UpdateState.Downloading:
            return 'TR_YOUR_NEW_VERSION_IS_DOWNLOADING';
        case UpdateState.Ready:
            return 'TR_YOUR_NEW_VERSION_IS_READY';
        case UpdateState.Available:
        default:
            return 'TR_YOUR_NEW_VERSION';
    }
};

export const VersionWithUpdate = () => {
    const desktopUpdate = useSelector(state => state.desktopUpdate);
    const dispatch = useDispatch();
    const { anchorRef, shouldHighlight } = useAnchor(SettingsAnchor.VersionWithUpdate);

    const checkForUpdates = () => desktopApi.checkForUpdates(true);
    const maximizeUpdater = () => dispatch(setUpdateWindow('maximized'));
    const install = () => dispatch(installUpdate());

    const appVersion = process.env.VERSION || '';

    return (
        <SectionItem
            data-test="@settings/version"
            ref={anchorRef}
            shouldHighlight={shouldHighlight}
        >
            <TextColumn
                title={<Translation id="TR_SUITE_VERSION" />}
                description={
                    <div>
                        <Translation
                            id="TR_YOUR_CURRENT_VERSION"
                            values={{
                                version: (
                                    <CerberusLink href={getReleaseUrl(appVersion)} variant="nostyle">
                                        <Button
                                            variant="tertiary"
                                            size="tiny"
                                            icon="EXTERNAL_LINK"
                                            iconAlignment="right"
                                        >
                                            {appVersion}
                                            {isDevEnv && '-dev'}
                                        </Button>
                                    </CerberusLink>
                                ),
                            }}
                        />
                        {[
                            UpdateState.Available,
                            UpdateState.Downloading,
                            UpdateState.Ready,
                        ].includes(desktopUpdate.state) &&
                            desktopUpdate.latest && (
                                <>
                                    &nbsp;
                                    <Translation
                                        id={getUpdateStateMessage(desktopUpdate.state)}
                                        values={{
                                            version: (
                                                <CerberusLink
                                                    href={getReleaseUrl(appVersion)}
                                                    variant="nostyle"
                                                >
                                                    <Button
                                                        variant="destructive"
                                                        size="tiny"
                                                        icon="EXTERNAL_LINK"
                                                        iconAlignment="right"
                                                    >
                                                        {desktopUpdate.latest.version}
                                                    </Button>
                                                </CerberusLink>
                                            ),
                                        }}
                                    />
                                </>
                            )}
                    </div>
                }
            />
            {desktopUpdate.enabled && (
                <ActionColumn>
                    {desktopUpdate.state === UpdateState.Checking && (
                        <ActionButton isDisabled variant="secondary">
                            <Translation id="SETTINGS_UPDATE_CHECKING" />
                        </ActionButton>
                    )}
                    {[
                        UpdateState.NotAvailable,
                        UpdateState.EarlyAccessDisable,
                        UpdateState.EarlyAccessEnable,
                    ].includes(desktopUpdate.state) && (
                        <ActionButton onClick={checkForUpdates} variant="secondary">
                            <Translation id="SETTINGS_UPDATE_CHECK" />
                        </ActionButton>
                    )}
                    {desktopUpdate.state === UpdateState.Available && (
                        <ActionButton onClick={maximizeUpdater} variant="secondary">
                            <Translation id="SETTINGS_UPDATE_AVAILABLE" />
                        </ActionButton>
                    )}
                    {desktopUpdate.state === UpdateState.Downloading && (
                        <ActionButton onClick={maximizeUpdater} variant="secondary">
                            <Translation id="SETTINGS_UPDATE_DOWNLOADING" />
                        </ActionButton>
                    )}
                    {desktopUpdate.state === UpdateState.Ready && (
                        <ActionButton onClick={install} variant="secondary">
                            <Translation id="SETTINGS_UPDATE_READY" />
                        </ActionButton>
                    )}
                </ActionColumn>
            )}
        </SectionItem>
    );
};
