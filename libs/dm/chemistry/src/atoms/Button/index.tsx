import React from 'react';
import { Button as ChakraButton, ButtonProps } from '@chakra-ui/react';

export const PrimaryButton = (props: ButtonProps) => (
  <ChakraButton
    bg={'brand.500'}
    color={'white'}
    _hover={{ bg: 'brand.500', opacity: props.isDisabled ?? false ? 0.4 : 0.8 }}
    {...props}
  />
);

export const NegativeButton = (props: ButtonProps) => (
  <ChakraButton
    bg={'#f85149'}
    color={'white'}
    _hover={{ bg: '#f85149', opacity: props.isDisabled ?? false ? 0.4 : 0.8 }}
    {...props}
  />
);
