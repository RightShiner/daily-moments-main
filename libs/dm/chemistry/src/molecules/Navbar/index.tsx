import { Box } from '@chakra-ui/react';
import React from 'react';
import { NavBarLink } from './chemistry/NavBarLink';
import { DesktopNavContent, MobileNavContent } from './chemistry/NavContent';

interface Props {
  children: React.ReactNode;
}

export const Navbar = ({ children }: Props) => (
  <Box as={'header'} bg={'white'} w={'100%'}>
    <Box maxW='8xl' mx='auto' px={{ base: 4, md: 8 }}>
      <Box as='nav' aria-label='Site navigation' w={'100%'}>
        {children}
      </Box>
    </Box>
  </Box>
);

export { DesktopNavContent, MobileNavContent };

export type { NavBarLink };
