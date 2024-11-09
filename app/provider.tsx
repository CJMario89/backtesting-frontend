'use client';

import { AntdRegistry } from '@ant-design/nextjs-registry';
import {
  PayPalHostedFieldsProvider,
  PayPalScriptProvider,
  ReactPayPalScriptOptions,
} from '@paypal/react-paypal-js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, theme } from 'antd';
import React from 'react';
import { IntlProvider } from 'react-intl';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: Infinity,
    },
  },
});

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

        <AntdRegistry>
          <ConfigProvider
            theme={{
              algorithm: theme.darkAlgorithm,
              token: {
                fontFamily: 'Inter',
                colorPrimaryText: 'white',
              },
            }}
          >
            {children}
          </ConfigProvider>
        </AntdRegistry>
        {/* </PayPalHostedFieldsProvider>
          </PayPalScriptProvider> */}
      </IntlProvider>
    </QueryClientProvider>
  );
}
