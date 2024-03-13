// import original module declarations
import 'styled-components';
import { SuiteThemeColors } from '@cerberus/components';
import { BoxShadows, Colors } from '@cerberus/theme';

declare module 'styled-components' {
    export interface DefaultTheme extends SuiteThemeColors, Colors, BoxShadows {}
}
