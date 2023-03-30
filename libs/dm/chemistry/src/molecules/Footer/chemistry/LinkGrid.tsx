import { Box, Link, SimpleGrid, SimpleGridProps, Stack } from '@chakra-ui/react';
import React from 'react';
import { FooterHeading } from './FooterHeading';

export const LinkGrid = (props: SimpleGridProps) => (
  <SimpleGrid columns={2} {...props}>
    <Box minW='130px'>
      <FooterHeading mb='4'>Product</FooterHeading>
      <Stack>
        <Link href={`https://www.dailymoments.io/blog`}>Blog</Link>
        {/*<Link href={`https://www.dailymoments.io/pricing`}>Pricing</Link>*/}
      </Stack>
    </Box>
    <Box minW='130px'>
      <FooterHeading mb='4'>Legal</FooterHeading>
      <Stack>
        <Link href={`https://www.dailymoments.io/legal/privacy-policy`}>
          Privacy Policy
        </Link>
        <Link href={`https://www.dailymoments.io/legal/terms-of-service`}>
          Terms of Service
        </Link>
        <Link href={`https://www.dailymoments.io/legal/data-deletion-policy`}>
          Data Deletion Policy
        </Link>
      </Stack>
    </Box>
  </SimpleGrid>
);
