'use client';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { buttonVariants } from '@/components/ui/button';
import useDeleteFinancialRecordModal from '@/hooks/useDeleteFinancialRecordModal';
import { FinancialRecord } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useCallback, useState } from 'react';
import { ButtonWithIcon } from '../ButtonWithIcon';
import { toast } from '../ui/use-toast';

const FinancialRecordDeleteModal = () => {
	const [isLoading, setIsLoading] = useState(false);

	const deleteFinancialRecordModal = useDeleteFinancialRecordModal();
	const queryClient = useQueryClient();

	const deleteRecord = async () => {
		await axios.delete(`/api/financial-records/${deleteFinancialRecordModal.deletedRecordId}`);
	};

	const deleteRecordMutation = useMutation({
		mutationFn: deleteRecord,
		onMutate: async () => {
			setIsLoading(true);
			await queryClient.cancelQueries({ queryKey: ['financial-records'] });

			const previousRecords: FinancialRecord[] | undefined = queryClient.getQueryData([
				'financial-records',
			]);

			queryClient.setQueriesData<FinancialRecord[]>(['financial-records'], (oldData) => {
				return oldData?.filter(
					(record: FinancialRecord) =>
						record.id !== deleteFinancialRecordModal.deletedRecordId
				);
			});

			return { previousRecords };
		},
		onError: (err, _, context) => {
			toast({
				variant: 'destructive',
				description:
					'Something went wrong while deleting the record. Please try again later.',
			});

			queryClient.setQueryData(['financial-records'], context?.previousRecords);
		},
		onSuccess: () => {
			toast({ description: 'Record deleted successfully' });
		},
		onSettled: () => {
			queryClient.invalidateQueries(['financial-records']);
			deleteFinancialRecordModal.setDeletedRecordId(null);
			setIsLoading(false);
		},
	});

	const handleClose = useCallback(() => {
		deleteFinancialRecordModal.setIsOpen(false);

		// Wait for the modal to close before resetting the deleted record id so that the api call can
		// be made with the correct id.
		setTimeout(() => {
			deleteFinancialRecordModal.setDeletedRecordId(null);
		}, 300);
	}, [deleteFinancialRecordModal]);

	return (
		<AlertDialog
			open={
				deleteFinancialRecordModal.isOpen &&
				deleteFinancialRecordModal.deletedRecordId !== null
			}
			onOpenChange={handleClose}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Confirmation</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete this financial record? This action cannot be
						undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction asChild>
						<ButtonWithIcon
							className={buttonVariants({ variant: 'destructive' })}
							onClick={() => deleteRecordMutation.mutate()}
							disabled={isLoading}
							loading={isLoading}
						>
							Delete
						</ButtonWithIcon>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default FinancialRecordDeleteModal;
