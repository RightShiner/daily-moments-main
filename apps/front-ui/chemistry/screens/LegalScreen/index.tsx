import { Box } from '@chakra-ui/react';
import React from 'react';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { Mdx } from '../../molecules/Mdx';

export interface LegalScreenProps {
  mdx: MDXRemoteSerializeResult;
}

export const Screen: React.FC<LegalScreenProps> = ({ mdx }) => (
  <Box maxW={'5xl'} mx={'auto'} p={{ base: 4, md: 8 }}>
    <Mdx mdx={mdx} maxW={'100%'} />
  </Box>
);
