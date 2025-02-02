import { Image, Pressable } from 'react-native';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import React, { useMemo, useState } from 'react';

import { prepareNativeStyle, useNativeStyles } from '@cerberus/styles';

import { ConfirmOnCerberusBottomSheet } from './ConfirmOnCerberusBottomSheet';

const imageContainerStyle = prepareNativeStyle(utils => ({
    position: 'absolute',
    bottom: -utils.spacings.medium, // Hides a part of the image under bottom screen edge.
    width: '100%',
    alignItems: 'center',
}));

export const ConfirmOnCerberusImage = () => {
    const [isBottomSheetOpened, setIsBottomSheetOpened] = useState(false);
    const { applyStyle } = useNativeStyles();

    const imageSource = useMemo(() => require('../../assets/confirmOnCerberus.png'), []);

    const handleImagePress = () => {
        setIsBottomSheetOpened(true);
    };

    const handleCloseBottomSheet = () => {
        setIsBottomSheetOpened(false);
    };

    return (
        <>
            <Animated.View
                entering={SlideInDown}
                exiting={SlideOutDown}
                style={applyStyle(imageContainerStyle)}
            >
                <Pressable onPress={handleImagePress}>
                    <Image source={imageSource} />
                </Pressable>
            </Animated.View>
            <ConfirmOnCerberusBottomSheet
                isOpened={isBottomSheetOpened}
                onClose={handleCloseBottomSheet}
            />
        </>
    );
};
