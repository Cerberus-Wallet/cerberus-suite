/** @type {Detox.DetoxConfig} */
module.exports = {
    testRunner: {
        args: {
            $0: 'jest',
            config: 'e2e/jest.config.js',
        },
        jest: {
            setupTimeout: 120000,
        },
    },
    apps: {
        'ios.debug': {
            type: 'ios.app',
            binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/TrezorSuiteDebug.app',
            build: 'xcodebuild -workspace ios/TrezorSuiteDebug.xcworkspace -scheme TrezorSuiteDebug -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build',
        },
        'ios.release': {
            type: 'ios.app',
            binaryPath: 'ios/build/Build/Products/Release-iphonesimulator/TrezorSuiteDebug.app',
            build: 'xcodebuild -workspace ios/TrezorSuiteDebug.xcworkspace -scheme TrezorSuiteDebug -configuration Release -sdk iphonesimulator -derivedDataPath ios/build',
        },
        'android.debug': {
            type: 'android.apk',
            binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
            build: 'cd android && ./gradlew :app:assembleDebug :app:assembleAndroidTest -DtestBuildType=debug',
            reversePorts: [8081, 21325],
        },
        'android.release': {
            type: 'android.apk',
            binaryPath: 'android/app/build/outputs/apk/release/app-release.apk',
            build: 'cd android && ./gradlew :app:assembleRelease :app:assembleAndroidTest -DtestBuildType=release',
            reversePorts: [21325],
        },
    },
    devices: {
        simulator: {
            type: 'ios.simulator',
            device: {
                type: 'iPhone 15',
            },
        },
        emulator: {
            type: 'android.emulator',
            device: {
                avdName: 'OnePlus_7_API_33',
            },
        },
    },
    configurations: {
        'ios.sim.debug': {
            device: 'simulator',
            app: 'ios.debug',
        },
        'ios.sim.release': {
            device: 'simulator',
            app: 'ios.release',
        },
        'android.emu.debug': {
            device: 'emulator',
            app: 'android.debug',
        },
        'android.emu.release': {
            device: 'emulator',
            app: 'android.release',
        },
    },
};
