import React from 'react';
import { Box, BoxProps } from '@chakra-ui/react';

interface Props {
  children: React.ReactNode;
}

export const Card = ({ children, ...props }: Props & BoxProps) => (
  <Box
    w={'100%'}
    mx='auto'
    overflow='hidden'
    border={'thin solid'}
    borderColor={'gray.200'}
    borderRadius={4}
    {...props}
  >
    {children}
  </Box>
);
