import { Box, BoxProps } from '@chakra-ui/react';
import React from 'react';

interface Props {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}

export const LabeledField = ({ label, htmlFor, children, ...rest }: Props & BoxProps) => (
  <Box {...rest}>
    <Box as={'label'} htmlFor={htmlFor} fontSize={'xs'} fontFamily={'Sora'}>
      {label}
    </Box>
    {children}
  </Box>
);
