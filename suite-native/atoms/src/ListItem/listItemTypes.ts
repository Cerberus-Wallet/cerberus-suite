import { ReactNode } from 'react';

import { IconName } from '@suite-common/icons';
import { NativeStyleObject } from '@cerberus/styles';

export type BaseListItem = {
    iconName?: IconName;
    title: ReactNode;
    subtitle?: string;
    onPress?: () => void;
    style?: NativeStyleObject;
    isTextTruncated?: boolean;
};
