import React from 'react';
import { Copyright } from './Copyright';
import { SocialMediaLinks } from './SocialMediaLinks';
import { Stack } from '@chakra-ui/react';

export const FooterBottom = () => (
  <Stack
    direction={{ base: 'column-reverse', md: 'row' }}
    justifyContent='space-between'
    alignItems='center'
    w={'100%'}
  >
    <Copyright />
    <SocialMediaLinks />
  </Stack>
);
