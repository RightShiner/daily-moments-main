import { Box, HStack, VStack } from '@chakra-ui/react';
import React from 'react';

interface Props {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const FeatureTile = ({ title, description, icon }: Props) => (
  <VStack borderRadius={4} py={{ base: 1, lg: 6 }} borderColor={'gray.100'} spacing={4}>
    <HStack w={'100%'} color={'brand.500'} spacing={4}>
      <Box>{icon}</Box>
      <Box as={'h3'} fontWeight={'bold'} fontSize={'xl'}>
        {title}
      </Box>
    </HStack>
    <Box as={'p'} textAlign={'start'}>
      {description}
    </Box>
  </VStack>
);
