import { ChakraProvider } from '@chakra-ui/react';
import { Navigate } from '../../components/navigate';
import Cookies from 'js-cookie';
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import { useState } from 'react';
export default function App({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient());
  const token = Cookies.get('jwt');

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <ChakraProvider>
          {token && <Navigate />}
          <Component {...pageProps} />
        </ChakraProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}
