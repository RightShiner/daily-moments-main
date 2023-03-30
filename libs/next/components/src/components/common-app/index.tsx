import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { Dict } from '@chakra-ui/utils';

interface CustomAppProps {
  theme?: Dict;
  children: React.ReactElement;
}

export const CommonApp = ({ theme, children }: CustomAppProps) => {
  return (
    <ChakraProvider theme={theme} resetCSS={true}>
      {children}
    </ChakraProvider>
  );
};
