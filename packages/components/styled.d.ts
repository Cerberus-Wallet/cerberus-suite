// import original module declarations
import 'styled-components';
import { BoxShadows, Colors } from '@cerberus/theme';
import { SuiteThemeColors } from './src/config/colors';

declare module 'styled-components' {
    export interface DefaultTheme extends SuiteThemeColors, Colors, BoxShadows {}
}
