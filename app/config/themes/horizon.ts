import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
//import Lara from '@primeuix/themes/lara';
//import Material from '@primeuix/themes/material';
//import Nora from '@primeuix/themes/nora';

export const HorzionTheme = definePreset (Aura,{
    semantic: {
        colorScheme: {
            light: {
                primary: {
                    50: '{zinc.50}',
                    100: '{zinc.100}',
                    200: '{zinc.200}',
                    300: '{zinc.300}',
                    400: '{zinc.400}',
                    500: '{zinc.500}',
                    600: '{zinc.600}',
                    700: '{zinc.700}',
                    800: '{zinc.800}',
                    900: '{zinc.900}',
                    950: '{zinc.950}'
                },
                surface: {
                    0: '#ffffff',
                    50: '{zinc.50}',
                    100: '{zinc.100}',
                    200: '{zinc.200}',
                    300: '{zinc.300}',
                    400: '{zinc.400}',
                    500: '{zinc.500}',
                    600: '{zinc.600}',
                    700: '{zinc.700}',
                    800: '{zinc.800}',
                    900: '{zinc.900}',
                    950: '{zinc.950}'
                }
            },
            dark: {
                primary: {
                    50: '{stone.50}',
                    100: '{stone.100}',
                    200: '{stone.200}',
                    300: '{stone.300}',
                    400: '{stone.400}',
                    500: '{stone.500}',
                    600: '{stone.600}',
                    700: '{stone.700}',
                    800: '{stone.800}',
                    900: '{stone.900}',
                    950: '{stone.950}'
                },
                surface: {
                    0: '#ffffff',
                    50: '{stone.50}',
                    100: '{stone.100}',
                    200: '{stone.200}',
                    300: '{stone.300}',
                    400: '{stone.400}',
                    500: '{stone.500}',
                    600: '{stone.600}',
                    700: '{stone.700}',
                    800: '{stone.800}',
                    900: '{stone.900}',
                    950: '{stone.950}'
                }
            }
        }
    }    
});