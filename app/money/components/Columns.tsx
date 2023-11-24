'use client';

import { Button } from '@/components/ui/button';
import { creationSchema } from '@/schemas/financialRecord';
import { formatCurrency } from '@/utils/formatFns';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { z } from 'zod';
import FinancialRecordControls from './FinancialRecordControls';

export const columns: ColumnDef<
	z.infer<typeof creationSchema> & { id: string; netWorth: number; totalAssets: number }
>[] = [
	{
		accessorKey: 'date',
		header: ({ column }) => {
			return (
				<Button
					className="p-2 my-1 ml-1"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Date
					<CaretSortIcon className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const date: Date = new Date(row.getValue('date'));
			const formatted = format(date, 'dd/MM/yyyy');

			return <div>{formatted}</div>;
		},
	},
	{
		accessorKey: 'grossIncomeYtd',
		header: ({ column }) => {
			return (
				<Button
					className="p-2 my-1"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Gross Income YTD
					<CaretSortIcon className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const currency = row.original.currency;
			const amount = parseFloat(row.getValue('grossIncomeYtd'));
			const formatted = formatCurrency(amount, currency);

			return <div>{formatted}</div>;
		},
	},
	{
		accessorKey: 'taxesPaidYtd',
		header: ({ column }) => {
			return (
				<Button
					className="p-2 my-1"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Taxes Paid YTD
					<CaretSortIcon className="ml-2 !h-4 !w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const currency = row.original.currency;
			const amount = parseFloat(row.getValue('taxesPaidYtd'));
			const formatted = formatCurrency(amount, currency);

			return <div>{formatted}</div>;
		},
	},
	{
		accessorKey: 'assetsExCash',
		header: ({ column }) => {
			return (
				<Button
					className="p-2 my-1"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Assets Ex Cash
					<CaretSortIcon className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const currency = row.original.currency;
			const amount = parseFloat(row.getValue('assetsExCash'));
			const formatted = formatCurrency(amount, currency);

			return <div>{formatted}</div>;
		},
	},
	{
		accessorKey: 'cash',
		header: ({ column }) => {
			return (
				<Button
					className="p-2 my-1"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Cash
					<CaretSortIcon className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const currency = row.original.currency;
			const amount = parseFloat(row.getValue('cash'));
			const formatted = formatCurrency(amount, currency);

			return <div>{formatted}</div>;
		},
	},
	{
		accessorKey: 'totalAssets',
		header: ({ column }) => {
			return (
				<Button
					className="p-2 my-1"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Total Assets
					<CaretSortIcon className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const currency = row.original.currency;
			const amount = parseFloat(row.getValue('totalAssets'));
			const formatted = formatCurrency(amount, currency);

			return <div>{formatted}</div>;
		},
	},
	{
		accessorKey: 'debt',
		header: ({ column }) => {
			return (
				<Button
					className="p-2 my-1"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Debt
					<CaretSortIcon className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const currency = row.original.currency;
			const amount = parseFloat(row.getValue('debt'));
			const formatted = formatCurrency(amount, currency);

			return <div>{formatted}</div>;
		},
	},
	{
		accessorKey: 'netWorth',
		header: ({ column }) => {
			return (
				<Button
					className="p-2 my-1"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Net Worth
					<CaretSortIcon className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const currency = row.original.currency;
			const amount = parseFloat(row.getValue('netWorth'));
			const red = 'text-red-800 dark:text-red-400';
			const green = 'text-green-800 dark:text-green-400';

			const formatted = formatCurrency(amount, currency);

			return <div className={amount > 0 ? green : amount !== 0 ? red : ''}>{formatted}</div>;
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const { netWorth, id, ...financialRecord } = row.original;

			return (
				<FinancialRecordControls financialRecordId={id} financialRecord={financialRecord} />
			);
		},
	},
];
