'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import React from 'react';

interface NextSessionProviderProps {
	children: React.ReactNode;
}

const NextSessionProvider = ({ children }: NextSessionProviderProps) => {
	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
			<SessionProvider>{children}</SessionProvider>
		</ThemeProvider>
	);
};

export default NextSessionProvider;
