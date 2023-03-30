import { Box, SimpleGrid, Divider } from '@chakra-ui/react';
import React from 'react';
import { FooterBottom } from './chemistry/FooterBottom';
import { FooterTop } from './chemistry/FooterTop';

export const Footer = () => (
  <Box as='footer' role='contentinfo' w={'100%'} bg={'gray.50'}>
    <SimpleGrid
      mx='auto'
      maxW='8xl'
      py={{ base: 6, md: 10 }}
      px={{ base: 4, md: 8 }}
      rowGap={{ base: 5, lg: 8 }}
      columns={1}
    >
      <FooterTop />
      <Divider gridColumn={'1 / span 2'} />
      <FooterBottom />
    </SimpleGrid>
  </Box>
);
