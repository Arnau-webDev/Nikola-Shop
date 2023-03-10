import type { AppProps } from 'next/app';

import { ThemeProvider, CssBaseline } from '@mui/material';

import { lightTheme } from '../themes';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<ThemeProvider theme={lightTheme}>
			<CssBaseline />
			<Component {...pageProps} />
		</ThemeProvider>
	);
}
