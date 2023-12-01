export interface ChartData {
	dates: Date[];
	grossIncomeYtd: number[];
	taxesPaidYtd: number[];
	assetsExCash: number[];
	cash: number[];
	totalAssets: number[];
	debt: number[];
	netWorth: number[];
	debtToTotalAssets: number[];
	debtToNetWorth: number[];
	currency: string[];
	datasetCurrency: string;
}
