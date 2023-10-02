import { getAuthSession } from '@/app/actions/auth';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import UserAccountNav from './UserAccountNav';
import { buttonVariants } from '../ui/button';

const Nav = async () => {
	const session = await getAuthSession();

	return (
		<div className="py-4 fixed inset-x-0 top-0 bg-white/75 dark:bg-slate-950/75 z-[50] h-fit border-b-2 border-slate-200 dark:border-slate-800 backdrop-blur-sm">
			<div className="flex items-center justify-between h-full gap-2 px-4 sm:px-8 mx-auto max-w-7xl">
				{/* Logo */}
				<Link href="/" className="flex items-center gap-2">
					<p className="font-bold">Money Mapper</p>
				</Link>

				<div className="flex lg:gap-8 gap-4">
					{session?.user && (
						<div className="md:flex gap-4 hidden">
							<Link className={buttonVariants({ variant: 'outline' })} href="/money">
								Money
							</Link>
							<Link
								className={buttonVariants({ variant: 'outline' })}
								href="/dashboard"
							>
								Dashboard
							</Link>
						</div>
					)}

					<div className="flex items-center gap-2 lg:gap-4">
						<ThemeToggle />
						{session?.user && <UserAccountNav user={session.user} />}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Nav;
