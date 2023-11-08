import { z } from 'zod';

export const creationSchema = z.object({
	date: z
		.string({ required_error: 'Please pick a date for this record' })
		.or(z.date({ required_error: 'Please pick a date for this record' }))
		.transform((arg) => new Date(arg)),
	currency: z
		.string({
			required_error: 'Please pick a currency for this record',
		})
		.min(2, {
			message: 'Currency must be 2 characters long',
		})
		.max(50, {
			message: 'Currency cannot be more than 50 characters long',
		}),
	grossIncomeYtd: z.preprocess(
		(val) => (val !== '' && Number(val) >= 0 ? Number(val) : ''),
		z
			.number({
				required_error: 'Please enter your gross income',
				invalid_type_error: 'Please enter a valid number',
			})
			.min(0, {
				message: 'Gross income cannot be negative',
			})
			.max(1_000_000_000, {
				message: 'Gross income cannot be more than 1 billion',
			})
	),
	taxesPaidYtd: z.preprocess(
		(val) => (val !== '' && Number(val) >= 0 ? Number(val) : ''),
		z
			.number({
				required_error: 'Please enter your taxes paid',
				invalid_type_error: 'Please enter a valid number',
			})
			.min(0, {
				message: 'Taxes paid cannot be negative',
			})
			.max(1_000_000_000, { message: 'Taxes paid cannot be more than 1 billion' })
	),
	assetsExCash: z.preprocess(
		(val) => (val !== '' && Number(val) >= 0 ? Number(val) : ''),
		z
			.number({
				required_error: 'Please enter your assets excluding cash',
				invalid_type_error: 'Please enter a valid number',
			})
			.min(0, {
				message: 'Assets excluding cash cannot be negative',
			})
			.max(1_000_000_000, {
				message: 'Assets excluding cash cannot be more than 1 billion',
			})
	),
	cash: z.preprocess(
		(val) => (val !== '' && Number(val) >= 0 ? Number(val) : ''),
		z
			.number({
				required_error: 'Please enter your total cash amount',
				invalid_type_error: 'Please enter a valid number',
			})
			.min(0, {
				message: 'Cash cannot be negative',
			})
			.max(1_000_000_000, {
				message: 'Cash cannot be more than 1 billion',
			})
	),
	debt: z.preprocess(
		(val) => (val !== '' && Number(val) >= 0 ? Number(val) : ''),
		z
			.number({
				required_error: 'Please enter your total debt amount',
				invalid_type_error: 'Please enter a valid number',
			})
			.min(0, {
				message: 'Debt cannot be negative',
			})
			.max(1_000_000_000, {
				message: 'Debt cannot be more than 1 billion',
			})
	),
});
