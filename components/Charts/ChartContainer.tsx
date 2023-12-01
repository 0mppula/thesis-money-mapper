import { cn } from '@/lib/utils';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

interface ChartContainerProps {
	title: string;
	children: React.ReactNode;
	className?: string;
	hasLegend?: boolean;
	isLoading: boolean;
	isError: boolean;
	data: {
		x: Date;
		currency: string;
	}[];
}

const ChartContainer = ({
	title,
	children,
	className,
	hasLegend = false,
	isError,
	isLoading,
	data,
}: ChartContainerProps) => {
	const content = () => {
		if (isLoading) {
			return <Skeleton className="h-[440px] w-full rounded-xl" />;
		} else if (isError) {
			return (
				<>
					<CardHeader>
						<CardTitle>{title}</CardTitle>
					</CardHeader>
					<div className="h-[376px] flex items-center justify-center px-4 text-center">
						An error occurred while loading your financial records. Please try again
						later.
					</div>
				</>
			);
		} else if (!data?.length) {
			return (
				<>
					<CardHeader>
						<CardTitle>{title}</CardTitle>
					</CardHeader>
					<div className="h-[376px] flex items-center justify-center px-4 text-center">
						{"You don't have any financial records yet. 📈"}
					</div>
				</>
			);
		} else {
			return (
				<>
					<CardHeader className={hasLegend ? 'pb-3' : ''}>
						<CardTitle>{title}</CardTitle>
					</CardHeader>
					<CardContent className="px-4">{children}</CardContent>
				</>
			);
		}
	};

	return <Card className={cn('col-span-1', className)}>{content()}</Card>;
};

export default ChartContainer;
