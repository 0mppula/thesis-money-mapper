'use client';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { FinancialRecord } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import xlsx, { IJsonSheet, ISettings } from 'json-as-xlsx';
import { Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ImSpinner8 } from 'react-icons/im';
import { getFinancialRecords } from './FinancialRecordTable';

const ExportDataButton = () => {
	const [canGenerateXlsx, setCanGenerateXlsx] = useState(true);

	const { data, isLoading, isError } = useQuery<
		(FinancialRecord & { netWorth: number; totalAssets: number })[]
	>({
		queryKey: ['financial-records'],
		queryFn: getFinancialRecords,
	});

	useEffect(() => {
		let rateLimit: NodeJS.Timeout;

		if (!canGenerateXlsx) {
			rateLimit = setTimeout(() => {
				setCanGenerateXlsx(true);

				toast({
					description: 'Data exported in excel format',
				});
			}, 500);
		}

		return () => {
			clearTimeout(rateLimit);
		};
	}, [canGenerateXlsx]);

	const downloadToExcel = async () => {
		const workbook = await new Promise((resolve) => {
			setCanGenerateXlsx(false);
			try {
				const columns: IJsonSheet[] = [
					{
						sheet: 'Money Breakdown',
						columns: [
							{
								label: 'Date', // @ts-ignore
								value: (row) => new Date(row?.date),
							},
							{
								label: 'Gross Income YTD',
								value: (row) => row?.grossIncomeYtd,
								format: '0.00',
							},
							{
								label: 'Taxes Paid YTD',
								value: (row) => row?.taxesPaidYtd,
								format: '0.00',
							},
							{
								label: 'Assets Ex Cash',
								value: (row) => row?.assetsExCash,
								format: '0.00',
							},
							{
								label: 'Total Cash',
								value: (row) => row?.cash,
								format: '0.00',
							},
							{
								label: 'Total Assets',
								value: (row) => row?.totalAssets,
								format: '0.00',
							},
							{
								label: 'Total Debt',
								value: (row) => row?.debt,
								format: '0.00',
							},
							{
								label: 'Net Worth',
								value: (row) => row?.netWorth,
								format: '0.00',
							},
						], // @ts-ignore
						content: data,
					},
				];

				const settings: ISettings = {
					fileName: `money-breakdown-${format(new Date(), 'yyyy-MM-dd')}`,
				};

				resolve(xlsx(columns, settings));
			} catch (error) {
				toast({
					description: 'Error exporting data to excel',
					variant: 'destructive',
				});
			}
		});

		return workbook;
	};

	return (
		<Button
			disabled={isLoading || isError || !canGenerateXlsx}
			onClick={downloadToExcel}
			suppressHydrationWarning
			variant="outline"
		>
			{!canGenerateXlsx ? (
				<ImSpinner8 className="h-4 w-4 mr-2 animate-spin" />
			) : (
				<Download className="h-[1.125rem] w-[1.125rem] mr-2" />
			)}
			{!canGenerateXlsx ? (
				<span className="sr-only">Loading...</span>
			) : (
				<span className="sr-only">Export data as xlsx</span>
			)}{' '}
			.xlsx
		</Button>
	);
};

export default ExportDataButton;
