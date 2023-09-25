import { TypographyH1 } from '@/components/TypographyH1';
import AuthForm from './components/AuthForm';

export default function Home() {
	return (
		<div className="container flex flex-col items-center justify-center pb-[117px] py-12 min-h-[calc(100vh-69px)]">
			<TypographyH1 center>Sign in to your account</TypographyH1>

			<AuthForm />
		</div>
	);
}
