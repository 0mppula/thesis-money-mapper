import { currencies } from '@/data/currencies';

export const getCurrencyLocale = (value: string): string => {
	return currencies.find((currency) => currency.value === value)?.locale || 'en-US';
};
