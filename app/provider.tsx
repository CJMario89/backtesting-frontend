'use client';

import getTheme from ' /theme';
import { ChakraProvider, DarkMode } from '@chakra-ui/react';
import {
  PayPalHostedFieldsProvider,
  PayPalScriptProvider,
  ReactPayPalScriptOptions,
} from '@paypal/react-paypal-js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { IntlProvider } from 'react-intl';

const queryClient = new QueryClient();

const initialOptions = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
  currency: 'USD',
  vault: true,
  intent: 'subscription',
} as ReactPayPalScriptOptions;

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <IntlProvider locale="en">
        <ChakraProvider theme={getTheme()}>
          {/* <PayPalScriptProvider options={initialOptions}>
            <PayPalHostedFieldsProvider
              createOrder={() => {
                // Here define the call to create and order
                return fetch('/your-server-side-integration-endpoint/orders')
                  .then((response) => response.json())
                  .then((order) => order.id)
                  .catch((err) => {
                    // Handle any error
                  });
              }}
            > */}
          <DarkMode>{children}</DarkMode>
          {/* </PayPalHostedFieldsProvider>
          </PayPalScriptProvider> */}
        </ChakraProvider>
      </IntlProvider>
    </QueryClientProvider>
  );
}
