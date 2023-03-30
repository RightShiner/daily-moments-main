import { AppProps } from 'next/app';
import React from 'react';
import { Box, VStack } from '@chakra-ui/react';
import '@fontsource/inter/400.css';
import '@fontsource/inter/variable-full.css';
import '@fontsource/sora/700.css';
import '@fontsource/sora/variable.css';
import { CommonApp } from '@dm/next/components';
import { theme } from '@dm/theme';
import { Footer } from '@dm/chemistry';
import { Navbar } from '../chemistry/molecules/Navbar';

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => (
  <CommonApp theme={theme}>
    <VStack bg={'white'} minH={'100vh'} width={'100%'}>
      <Navbar />
      <Box flexGrow={1} w={'100%'}>
        <Component {...pageProps} />
      </Box>
      <Footer />
    </VStack>
  </CommonApp>
);

export default App;
