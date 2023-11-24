'use client';

import { ButtonWithIcon } from '@/components/ButtonWithIcon';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { currencies } from '@/data/currencies';
import useEditFinancialRecordModal from '@/hooks/useEditFinancialRecordModal';
import { cn } from '@/lib/utils';
import { creationSchema } from '@/schemas/financialRecord';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const EditFinancialRecordForm = () => {
	const [isLoading, setIsLoading] = useState(false);

	const { toast } = useToast();
	const { isOpen, setIsOpen, editedRecord, editedRecordId, setEditedRecord, setEditedRecordId } =
		useEditFinancialRecordModal();
	const queryClient = useQueryClient();

	useEffect(() => {
		if (!editedRecord) return;

		form.reset({
			date: new Date(editedRecord.date),
			currency: editedRecord.currency,
			grossIncomeYtd: editedRecord.grossIncomeYtd,
			taxesPaidYtd: editedRecord.taxesPaidYtd,
			assetsExCash: editedRecord.assetsExCash,
			cash: editedRecord.cash,
			debt: editedRecord.debt,
		});
	}, [editedRecord]);

	const form = useForm<z.infer<typeof creationSchema>>({
		resolver: zodResolver(creationSchema),
		defaultValues: {
			date: new Date(),
			currency: 'usd',
			grossIncomeYtd: 0,
			taxesPaidYtd: 0,
			assetsExCash: 0,
			cash: 0,
			debt: 0,
		},
	});

	const editFinancialRecord = async (values: z.infer<typeof creationSchema>) => {
		await axios.patch(`/api/financial-records/${editedRecordId}`, values);
	};

	const mutation = useMutation({
		mutationFn: editFinancialRecord,
		onMutate: async (values: z.infer<typeof creationSchema>) => {
			setIsLoading(true);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['financial-records'] });

			toast({
				description: 'Record edited successfully.',
			});

			setIsOpen(false);
			form.reset();
		},
		onError: () => {
			toast({
				description:
					'Something went wrong while editing the record. Please try again later.',
				variant: 'destructive',
			});
		},
		onSettled: () => {
			setIsLoading(false);
		},
	});

	return (
		<Dialog
			open={isOpen}
			onOpenChange={() => {
				form.reset();
				setIsOpen((prev) => !prev);
			}}
		>
			<DialogContent className="max-w-2xl overflow-y-auto max-h-[calc(100vh-2rem)]">
				<DialogHeader>
					<DialogTitle className="mb-2">Edit financial record</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
						className="space-y-4"
					>
						<div className="flex flex-col sm:flex-row gap-4">
							{/* Date field */}
							<FormField
								control={form.control}
								name="date"
								render={({ field }) => (
									<FormItem className="flex flex-col justify-between w-full">
										<FormLabel className="mt-[5px] w-full">
											Date of recording
										</FormLabel>

										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														className={cn(
															'w-100 pl-3 text-left font-normal',
															!field.value && 'text-muted-foreground'
														)}
													>
														{field.value ? (
															format(field.value, 'PPP')
														) : (
															<span>Pick a date</span>
														)}
														<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>

											<PopoverContent className="w-auto p-0" align="start">
												<Calendar
													mode="single"
													selected={field.value}
													onSelect={field.onChange}
													disabled={(date) =>
														date < new Date('1900-01-01')
													}
												/>
											</PopoverContent>
										</Popover>

										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Currency field */}
							<FormField
								control={form.control}
								name="currency"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel>Currency</FormLabel>
										<Select
											onValueChange={(value) => {
												field.onChange(value);
												localStorage.setItem('preferredCurrency', value);
											}}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select your currency" />
												</SelectTrigger>
											</FormControl>

											<SelectContent>
												{currencies.map((currency) => (
													<SelectItem
														key={currency.name}
														value={currency.value}
													>
														{currency.name} {currency.symbol}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="flex flex-col sm:flex-row gap-4">
							{/* Gross income field */}
							<FormField
								control={form.control}
								name="grossIncomeYtd"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel>Gross income year-to-date</FormLabel>
										<FormControl>
											<Input
												type="number"
												step="0.01"
												placeholder="30000"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Taxes paid field */}
							<FormField
								control={form.control}
								name="taxesPaidYtd"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel>Taxes paid year-to-date</FormLabel>
										<FormControl>
											<Input
												type="number"
												step="0.01"
												placeholder="15000"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="flex flex-col sm:flex-row gap-4">
							{/* Assets excluding cash field */}
							<FormField
								control={form.control}
								name="assetsExCash"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel>Assets excluding cash</FormLabel>
										<FormControl>
											<Input
												type="number"
												step="0.01"
												placeholder="10000"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Cash field */}
							<FormField
								control={form.control}
								name="cash"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel>Cash</FormLabel>
										<FormControl>
											<Input
												type="number"
												step="0.01"
												placeholder="10000"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Debt field */}
						<FormField
							control={form.control}
							name="debt"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Debt</FormLabel>
									<FormControl>
										<Input
											type="number"
											step="0.01"
											placeholder="10000"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter>
							<ButtonWithIcon loading={isLoading} type="submit">
								Save
							</ButtonWithIcon>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default EditFinancialRecordForm;
