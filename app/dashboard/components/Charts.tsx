'use client';

import { getFinancialRecords } from '@/app/money/components/FinancialRecordTable';
import BarChart from '@/components/Charts/BarChart';
import { ChartData } from '@/types/chart-data';
import getMostCommonElement from '@/utils/getMostCommonElement';
import { getPreferredCurrency } from '@/utils/localStorageFns';
import { FinancialRecord } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import ChartGroupSeperator from './ChartGroupSeperator';

const Charts = () => {
	const { data, isLoading, isError } = useQuery<(FinancialRecord & { netWorth: number })[]>({
		queryKey: ['financial-records'],
		queryFn: getFinancialRecords,
	});

	const chartDataByDate = useMemo(() => {
		const chartData: ChartData = {
			dates: [],
			grossIncomeYtd: [],
			taxesPaidYtd: [],
			assetsExCash: [],
			cash: [],
			totalAssets: [],
			debt: [],
			netWorth: [],
			debtToTotalAssets: [],
			debtToNetWorth: [],
			currency: [],
			datasetCurrency: getPreferredCurrency(),
		};

		const sortedData = [...(data || [])].sort(
			(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
		);

		sortedData.forEach((record) => {
			const date = new Date(record.date);
			const grossIncomeYtd = record.grossIncomeYtd;
			const taxesPaidYtd = record.taxesPaidYtd;
			const assetsExCash = record.assetsExCash;
			const cash = record.cash;
			const totalAssets = assetsExCash + cash;
			const debt = record.debt;
			const netWorth = totalAssets - debt;
			const debtToTotalAssets = totalAssets !== 0 ? (debt / totalAssets) * 100 : 0;
			const debtToNetWorth = netWorth !== 0 ? (debt / netWorth) * 100 : 0;
			const currency = record.currency;

			chartData.dates.push(date);
			chartData.grossIncomeYtd.push(grossIncomeYtd);
			chartData.taxesPaidYtd.push(taxesPaidYtd);
			chartData.assetsExCash.push(assetsExCash);
			chartData.cash.push(cash);
			chartData.debt.push(debt);
			chartData.totalAssets.push(totalAssets);
			chartData.netWorth.push(netWorth);
			chartData.debtToTotalAssets.push(debtToTotalAssets);
			chartData.debtToNetWorth.push(debtToNetWorth);
			chartData.currency.push(currency);
		});

		chartData.datasetCurrency = getMostCommonElement(chartData.currency);

		return chartData;
	}, [data]);

	const generateTableData = useMemo(
		() =>
			(
				categories: Exclude<keyof ChartData, 'currency' | 'dates' | 'datasetCurrency'>[],
				labels: string[]
			) => {
				const dates = chartDataByDate.dates;

				const tableData = dates.map((date, index) => {
					let categoryValues: { [key: string]: number } = {};

					categories.forEach((category, i) => {
						categoryValues[`y${i}`] = chartDataByDate[category][index];
					});

					const currency = chartDataByDate.currency[index];

					return { x: date, currency, ...categoryValues };
				});

				return {
					data: tableData,
					barData: {
						count: categories.length,
						categories: labels,
					},
				};
			},
		[chartDataByDate]
	);

	const { datasetCurrency } = chartDataByDate;

	return (
		<div className="mt-12">
			<ChartGroupSeperator title="Income & Taxes" />

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8">
				<BarChart
					isLoading={isLoading}
					isError={isError}
					title="Gross Income Year-to-Date"
					data={generateTableData(['grossIncomeYtd'], ['Gross income YTD'])}
					datasetCurrency={datasetCurrency}
				/>

				<BarChart
					isLoading={isLoading}
					isError={isError}
					title="Taxes Paid Year-to-Date"
					data={generateTableData(['taxesPaidYtd'], ['Taxes paid YTD'])}
					datasetCurrency={datasetCurrency}
				/>
			</div>

			<ChartGroupSeperator title="Assets & Cash" />

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8">
				<BarChart
					isLoading={isLoading}
					isError={isError}
					title="Total cash"
					data={generateTableData(['cash'], ['Cash'])}
					datasetCurrency={datasetCurrency}
				/>

				<BarChart
					isLoading={isLoading}
					isError={isError}
					title="Total Assets Excluding Cash"
					data={generateTableData(['assetsExCash'], ['Assets ex cash'])}
					datasetCurrency={datasetCurrency}
				/>

				<BarChart
					isLoading={isLoading}
					isError={isError}
					title="Total Assets"
					data={generateTableData(['totalAssets'], ['Assets'])}
					datasetCurrency={datasetCurrency}
				/>

				<BarChart
					isLoading={isLoading}
					isError={isError}
					title="Total Assets by Type"
					data={generateTableData(['cash', 'assetsExCash'], ['Cash', 'Assets ex cash'])}
					showLegend
					datasetCurrency={datasetCurrency}
				/>
			</div>

			<ChartGroupSeperator title="Debt" />

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8">
				<BarChart
					isLoading={isLoading}
					isError={isError}
					title="Total Debt"
					data={generateTableData(['debt'], ['Debt'])}
					datasetCurrency={datasetCurrency}
				/>

				<BarChart
					isLoading={isLoading}
					isError={isError}
					title="Total Debt / Total Assets"
					data={generateTableData(['debtToTotalAssets'], ['Debt /  assets'])}
					dataType="percentage"
					datasetCurrency={datasetCurrency}
				/>

				<BarChart
					isLoading={isLoading}
					isError={isError}
					title="Total Debt / Net Worth"
					data={generateTableData(['debtToNetWorth'], ['Debt /  net worth'])}
					dataType="percentage"
					className="md:col-span-2"
					datasetCurrency={datasetCurrency}
				/>
			</div>

			<ChartGroupSeperator title="Net Worth" />

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8">
				<BarChart
					isLoading={isLoading}
					isError={isError}
					title="Net Worth"
					data={generateTableData(['netWorth'], ['Net worth'])}
					datasetCurrency={datasetCurrency}
				/>

				<BarChart
					isLoading={isLoading}
					isError={isError}
					title="Total Cash, Assets Excluding Cash & Debt"
					data={generateTableData(
						['cash', 'assetsExCash', 'debt'],
						['Cash', 'Assets ex cash', 'Debt']
					)}
					datasetCurrency={datasetCurrency}
					showLegend
				/>
			</div>
		</div>
	);
};

export default Charts;
