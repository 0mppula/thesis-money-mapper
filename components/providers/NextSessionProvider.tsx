'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import React from 'react';

interface NextSessionProviderProps {
	children: React.ReactNode;
}
const queryClient = new QueryClient();

const NextSessionProvider = ({ children }: NextSessionProviderProps) => {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
				<SessionProvider>{children}</SessionProvider>
			</ThemeProvider>
		</QueryClientProvider>
	);
};

export default NextSessionProvider;
