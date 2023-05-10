import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';

import { PayPalScriptProvider } from '@paypal/react-paypal-js';

import { SWRConfig } from 'swr';
import { ThemeProvider, CssBaseline } from '@mui/material';

import { lightTheme } from '../themes';
import { AuthProvider, CartProvider, UIProvider } from '@/context';

import '@/styles/globals.css';

export default function App({ Component, pageProps: {session, ...pageProps} }: AppProps) {
	return (
		<SessionProvider session={session}>
			<PayPalScriptProvider options={{'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ''}}>
				<SWRConfig 
					value={{
						fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
					}}
				>
					<AuthProvider>
						<UIProvider>
							<CartProvider >
								<ThemeProvider theme={lightTheme}>
									<CssBaseline />
									<Component {...pageProps} />
								</ThemeProvider>
							</CartProvider>
						</UIProvider>
					</AuthProvider>
				</SWRConfig>

			</PayPalScriptProvider>
		</SessionProvider>

	);
}
