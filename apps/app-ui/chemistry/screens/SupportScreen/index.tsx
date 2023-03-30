import React from 'react';
import { PageWithSession, ProtectedContentProps } from '../../molecules/PageWithSession';
import { Box, Heading, Link, VStack } from '@chakra-ui/react';

export const Screen = () => <PageWithSession contentRenderer={AuthenticatedScreen} />;

const AuthenticatedScreen = (props: ProtectedContentProps) => (
  <VStack
    maxW={{ md: '3xl' }}
    mx={'auto'}
    px={{ base: 4, md: 8 }}
    py={4}
    w={'100%'}
    spacing={{ base: 6, md: 10 }}
  >
    <Heading as={'h1'}>Support</Heading>
    <Box as={'p'} textAlign={'center'}>
      Need help or is something not working for you? Send an email to{' '}
      <b>
        <Link href={'mailto: support@dailymoments.io'}>support@dailymoments.io</Link>
      </b>{' '}
      and we'll be sure to get back to you shortly.
    </Box>
  </VStack>
);
