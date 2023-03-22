import type { AppProps } from 'next/app';

import { SWRConfig } from 'swr';
import { ThemeProvider, CssBaseline } from '@mui/material';

import { lightTheme } from '../themes';
import { CartProvider, UIProvider } from '@/context';

import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<SWRConfig 
			value={{
				fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
			}}
		>
			<UIProvider>
				<CartProvider >
					<ThemeProvider theme={lightTheme}>
						<CssBaseline />
						<Component {...pageProps} />
					</ThemeProvider>
				</CartProvider>
			</UIProvider>
		</SWRConfig>
	);
}
