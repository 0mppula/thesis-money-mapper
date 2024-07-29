import Nav from '@/components/Nav/Nav';
import NextSessionProvider from '@/components/providers/NextSessionProvider';
import { Toaster } from '@/components/ui/toaster';
import { mainAppDescription } from '@/constants';
import { cn } from '@/lib/utils';
import createAppTitle from '@/utils/createAppTitle';
import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import Footer from '@/components/Footer';
import './globals.css';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: createAppTitle('Sign in'),
	description: mainAppDescription,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html className={cn(inter.className, 'antialiased')} lang="en" suppressHydrationWarning>
			<body className="min-h-screen text-slate-900 dark:text-slate-50 bg-slate-100 dark:bg-slate-950 antialiased pt-[68px] pb-16">
				<NextSessionProvider>
					<Nav />

					{children}
					<Analytics />

					<Toaster />

					<Footer />
				</NextSessionProvider>
			</body>
		</html>
	);
}
