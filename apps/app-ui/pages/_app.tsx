import { AppProps } from 'next/app';
import React from 'react';
import { CommonApp } from '@dm/next/components';
import { Box, VStack } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import { store } from '../store';
import '@fontsource/inter/400.css';
import '@fontsource/inter/variable-full.css';
import '@fontsource/sora/700.css';
import '@fontsource/sora/variable.css';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import { SessionProvider } from 'next-auth/react';
import { useSetupAxios } from '../hooks/useSetupAxios';
import { theme } from '@dm/theme';
import { Navbar } from '../chemistry/molecules/Navbar';
import { Footer } from '@dm/chemistry';

const AppInSessionProvider = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  useSetupAxios();
  return (
    <CommonApp theme={theme}>
      <VStack bg={'white'} minH={'100vh'} width={'100%'}>
        <Navbar />
        <Box flexGrow={1} w={'100%'} minH={'55vh'}>
          <Component {...pageProps} />
        </Box>
        <Footer />
      </VStack>
    </CommonApp>
  );
};

const AppInProvider = (props: AppProps) => {
  const {
    pageProps: { session },
  } = props;

  return (
    <SessionProvider session={session}>
      <AppInSessionProvider {...props} />
    </SessionProvider>
  );
};

const App = (props: AppProps) => (
  <Provider store={store}>
    <AppInProvider {...props} />
  </Provider>
);

export default App;
