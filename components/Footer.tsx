import { cn } from '@/lib/utils';
import { Code2, Github, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from './ui/button';
import { Separator } from './ui/separator';

const Footer = () => {
	const socials = [
		{
			name: 'GitHub',
			url: 'https://github.com/0mppula',
			icon: <Github className="h-[1.5rem] w-[1.5rem]" />,
		},
		{
			name: 'LinkedIn',
			url: 'https://www.linkedin.com/in/omarkraidie/',
			icon: <Linkedin className="h-[1.5rem] w-[1.5rem]" />,
		},
		{
			name: 'Email',
			url: 'mailto:devomarkraidie@gmail.com',
			icon: <Mail className="h-[1.5rem] w-[1.5rem]" />,
		},
		{
			name: 'Source Code',
			url: 'https://github.com/0mppula/thesis-money-mapper',
			icon: <Code2 className="h-[1.5rem] w-[1.5rem]" />,
		},
	];

	return (
		<footer className="w-full pt-16 pb-8 text-center border-slate-200 dark:border-slate-800 border-t-2 bg-white/75 dark:bg-slate-950/75">
			<div className="flex sm:gap-8 gap-4 items-center justify-center">
				{socials.map((social) => (
					<Link
						key={social.name}
						target="_blank"
						rel="noopener noreferrer"
						className={cn(
							buttonVariants({ variant: 'ghost', size: 'icon' }),
							'rounded-full h-12 w-12'
						)}
						href={social.url}
					>
						{social.icon}

						<span className="sr-only">{social.name}</span>
					</Link>
				))}
			</div>

			<Separator className="mb-6 mt-4 w-[min(350px,80vw)] bg-lime-800 dark:bg-lime-400  mx-auto" />

			<div>
				<span>Developed by </span>
				<Link
					href="https://www.omarkraidie.com/"
					target="_blank"
					rel="noopener noreferrer"
					className="active:decoration-lime-800 active:decoration-dashed dark:active:decoration-lime-400 underline"
				>
					Omar Kraidié
				</Link>
			</div>
		</footer>
	);
};

export default Footer;
