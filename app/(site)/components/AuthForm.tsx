'use client';

import { ButtonWithIcon } from '@/components/ButtonWithIcon';
import { useToast } from '@/components/ui/use-toast';
// import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { FaGithub, FaGoogle } from 'react-icons/fa';

const AuthForm = () => {
	const [googleIsLoading, setGoogleIsLoading] = useState(false);
	const [githubIsLoading, setGithubIsLoading] = useState(false);

	const { toast } = useToast();

	const socialAction = async (provider: string) => {
		if (provider === 'google') {
			setGoogleIsLoading(true);
		}

		if (provider === 'github') {
			setGithubIsLoading(true);
		}

		// await signIn(provider, { callbackUrl: '/money' }).then((callback) => {
		// 	if (callback?.error) {
		// 		toast({
		// 			description: 'Invalid credentials. Please try again.',
		// 		});
		// 	}
		// });
	};

	return (
		<form
			className="gap-4 flex flex-col mt-4 lg:mt-8 px-4 py-6 sm:px-10 w-full sm:max-w-lg max-w-md rounded-xl border bg-card text-card-foreground shadow"
			onSubmit={(e) => e.preventDefault()}
		>
			<ButtonWithIcon
				loading={googleIsLoading}
				disabled={googleIsLoading || githubIsLoading}
				type="button"
				className="w-full"
				icon={FaGoogle}
				onClick={() => socialAction('google')}
			>
				Continue with Google
			</ButtonWithIcon>

			<ButtonWithIcon
				loading={githubIsLoading}
				disabled={googleIsLoading || githubIsLoading}
				type="button"
				className="w-full"
				icon={FaGithub}
				onClick={() => socialAction('github')}
			>
				Continue with Github
			</ButtonWithIcon>
		</form>
	);
};

export default AuthForm;
