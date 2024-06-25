'use client';

import getTheme from ' /theme';
import { ChakraProvider, DarkMode } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { IntlProvider } from 'react-intl';
const queryClient = new QueryClient();
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <IntlProvider locale="en">
        <ChakraProvider theme={getTheme()}>
          <DarkMode>{children}</DarkMode>
        </ChakraProvider>
      </IntlProvider>
    </QueryClientProvider>
  );
}
