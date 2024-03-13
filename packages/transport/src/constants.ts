// usb const
export const CONFIGURATION_ID = 1;
export const INTERFACE_ID = 0;
export const ENDPOINT_ID = 1;
export const T1_HID_VENDOR = 0x534c;
export const CERBERUS_USB_DESCRIPTORS = [
    // CERBERUS v1
    // won't get opened, but we can show error at least
    { vendorId: 0x534c, productId: 0x0001 },
    // CERBERUS webusb Bootloader
    { vendorId: 0x1209, productId: 0x53c0 },
    // CERBERUS webusb Firmware
    { vendorId: 0x1209, productId: 0x53c1 },
];

/**
 * How long is single transport action (call, acquire) allowed to take
 */
export const ACTION_TIMEOUT = 10000;

export const TRANSPORT = {
    START: 'transport-start',
    ERROR: 'transport-error',
    UPDATE: 'transport-update',
    DISABLE_WEBUSB: 'transport-disable_webusb',
    REQUEST_DEVICE: 'transport-request_device',
} as const;
