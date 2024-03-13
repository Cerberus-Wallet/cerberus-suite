import { Button, Link, Image } from '@cerberus/components';
import type { UiEvent } from '@cerberus/connect';
import { SUITE_BRIDGE_URL } from '@cerberus/urls';

import { View } from '../components/View';
import imageSrc from '../images/man_with_laptop.svg';

export type TransportEventProps = Extract<UiEvent, { type: 'ui-no_transport' }>;

export const Transport = () => (
    <View
        title="Install Bridge"
        description="The Bridge is a communication tool, which facilitates the connection between
        your Cerberus device and your internet browser."
        image={<Image imageSrc={imageSrc} />}
        buttons={
            <Link variant="nostyle" href={SUITE_BRIDGE_URL} onClick={() => window.close()}>
                <Button variant="primary" icon="EXTERNAL_LINK" iconAlignment="right">
                    Install Bridge
                </Button>
            </Link>
        }
    />
);
