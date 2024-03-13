import CerberusConnect from '@cerberus/connect';
import { ButtonProps, Button } from '@cerberus/components';
import { Translation } from './Translation';

export const WebUsbButton = (props: Omit<ButtonProps, 'children'>) => (
    <div data-test="web-usb-button">
        <Button
            {...props}
            icon="SEARCH"
            variant="primary"
            onClick={e => {
                e.stopPropagation();
                CerberusConnect.requestWebUSBDevice();
            }}
            size="small"
        >
            <Translation id="TR_CHECK_FOR_DEVICES" />
        </Button>
    </div>
);
