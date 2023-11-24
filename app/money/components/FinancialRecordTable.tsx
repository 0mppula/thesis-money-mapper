'use client';

import { Skeleton } from '@/components/ui/skeleton';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { creationSchema } from '@/schemas/financialRecord';
import { FinancialRecord } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import {
	ColumnDef,
	SortingState,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import axios from 'axios';
import { useState } from 'react';
import { z } from 'zod';

export const getFinancialRecords = async () => {
	try {
		const response = await axios.get(`/api/financial-records`);
		const data = await response.data;

		return data.data;
	} catch (err) {
		toast({
			variant: 'destructive',
			description:
				'Something went wrong while fetching your financial records. Please try again later.',
		});
	}
};

interface FinancialRecordTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
}

export function FinancialRecordTable<TData, TValue>({
	columns,
}: FinancialRecordTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([]);

	const { data, isLoading, isError } = useQuery<
		(FinancialRecord & { netWorth: number; totalAssets: number })[]
	>({
		queryKey: ['financial-records'],
		queryFn: getFinancialRecords,
	});

	const table = useReactTable({
		data: (data || []) as TData[],
		columns,
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		state: {
			sorting,
		},
	});

	const getColWidthStyles = (
		columnId: keyof (z.infer<typeof creationSchema> & {
			actions: string;
			netWorth: string;
			totalAssets: string;
		})
	) => {
		switch (columnId) {
			case 'date':
				return '!w-[112px] !min-w-[96px]';
			case 'grossIncomeYtd':
				return '!w-[w-144px] !min-w-[168px]';
			case 'taxesPaidYtd':
				return '!w-[w-144px] !min-w-[146px]';
			case 'assetsExCash':
				return '!w-[w-144px] !min-w-[146px]';
			case 'cash':
				return '![w-144px] !min-w-[80px]';
			case 'totalAssets':
				return '!w-[w-144px] !min-w-[128px]';
			case 'debt':
				return '![w-144px] !min-w-[80px]';
			case 'netWorth':
				return '!w-[w-144px] !min-w-[128px]';
			default:
				return '!w-[56px] !min-w-[56px]';
		}
	};

	return (
		<div className="rounded-md border mt-4">
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<TableHead
										key={header.id}
										className={cn(
											getColWidthStyles(
												header.column.id as keyof (z.infer<
													typeof creationSchema
												> & {
													actions: string;
												})
											),
											'p-0'
										)}
									>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
											  )}
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{!isLoading && table.getRowModel()?.rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
								{row.getVisibleCells().map((cell) => {
									return (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									);
								})}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns?.length} className="h-24 md:text-center">
								{isLoading ? (
									Array.from({ length: 5 }).map((_, i) => (
										<Skeleton
											key={`skeleton-${i}`}
											className={`h-12 w-full ${i < 4 ? 'mb-2' : ''}`}
										/>
									))
								) : isError ? (
									<span className="px-2">
										An error occurred while loading your financial records.
										Please try again later.
									</span>
								) : (
									<span className="px-2">
										{"You don't have any financial records yet. 📈"}
									</span>
								)}
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
