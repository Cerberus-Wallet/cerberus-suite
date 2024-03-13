const CerberusConnect = require('@cerberus/connect').default;
const { TRANSPORT_EVENT, DEVICE_EVENT } = require('@cerberus/connect');

/**
 * Please note, that this example needs:
 * - Cerberus bridge running
 * - Device connected to USB
 */
const runExample = async () => {
    await CerberusConnect.init({
        manifest: {
            appUrl: 'my app',
            email: 'app@myapp.meow',
        },
    });

    // this event will be fired when bridge starts or stops or there is no bridge running
    CerberusConnect.on(TRANSPORT_EVENT, event => {
        console.log(event);
    });

    // this event will be fired when device connects, disconnects or changes
    CerberusConnect.on(DEVICE_EVENT, event => {
        console.log(event);
    });

    const result = await CerberusConnect.getFeatures();

    console.log(result);

    if (!result.success) {
        process.exit(1);
    } else {
        process.exit(0);
    }
};

runExample();
