import {extendTheme} from '@chakra-ui/react';

export const colors = {
  gray: {
    50: '#F7FAFC',
    100: '#EDF2F7',
    200: '#E2E8F0',
    300: '#CBD5E0',
    400: '#A0AEC0',
    500: '#718096',
    600: '#4A5568',
    700: '#2D3748',
    800: '#1A202C',
    900: '#171923',
  },
  brand: {
    500: '#63ADF2',
  }
}

export const theme = extendTheme({
  fonts: {
    heading: 'SoraVariable',
    body: 'InterVariable',
  },
  colors,
});
