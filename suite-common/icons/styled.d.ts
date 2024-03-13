// import original module declarations
import 'styled-components';
import { Colors } from '@cerberus/theme';

declare module 'styled-components' {
    export interface DefaultTheme extends Colors {}
}
