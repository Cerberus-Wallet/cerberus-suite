export const MESSAGE_HEADER_BYTE = 0x23;
export const HEADER_SIZE = 1 + 1 + 4 + 2;
export const BUFFER_SIZE = 63;

export const T1HID_VENDOR = 0x534c;
export const CONFIGURATION_ID = 1;
export const INTERFACE_ID = 0;
export const ENDPOINT_ID = 1;

export const TREZOR_DESCS = [
    // TREZOR v1
    // won't get opened, but we can show error at least
    { vendorId: 0x534c, productId: 0x0001 },
    // TREZOR webusb Bootloader
    { vendorId: 0x1209, productId: 0x53c0 },
    // TREZOR webusb Firmware
    { vendorId: 0x1209, productId: 0x53c1 },
];
