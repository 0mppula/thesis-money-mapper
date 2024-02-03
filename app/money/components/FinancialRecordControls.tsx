'use client';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useDeleteFinancialRecordModal from '@/hooks/useDeleteFinancialRecordModal';
import useEditFinancialRecordModal from '@/hooks/useEditFinancialRecordModal';
import { creationSchema } from '@/schemas/financialRecord';
import { Edit2, MoreHorizontal, Trash2 } from 'lucide-react';
import { useCallback } from 'react';
import { z } from 'zod';

interface FinancialRecordControlsProps {
	financialRecordId: string;
	financialRecord: z.infer<typeof creationSchema>;
}

const FinancialRecordControls = ({
	financialRecord,
	financialRecordId,
}: FinancialRecordControlsProps) => {
	const editFinancialRecordModal = useEditFinancialRecordModal();
	const deleteFinancialRecordModal = useDeleteFinancialRecordModal();

	const handleEdit = useCallback(() => {
		editFinancialRecordModal.setIsOpen(true);
		editFinancialRecordModal.setEditedRecordId(financialRecordId);
		editFinancialRecordModal.setEditedRecord(financialRecord);
	}, [editFinancialRecordModal, financialRecord, financialRecordId]);

	const handleDelete = useCallback(() => {
		deleteFinancialRecordModal.setIsOpen(true);
		deleteFinancialRecordModal.setDeletedRecordId(financialRecordId);
	}, [deleteFinancialRecordModal, financialRecordId]);

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0" title="Open menu">
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent align="end">
					<DropdownMenuItem className="flex gap-2" onClick={handleEdit}>
						<Edit2 className="h-[1.125rem] w-[1.125rem]" />
						<span>Edit</span>
					</DropdownMenuItem>

					<DropdownMenuItem
						className="flex gap-2 focus:bg-destructive/25"
						onClick={handleDelete}
					>
						<Trash2 className="h-[1.125rem] w-[1.125rem]" />
						<span>Delete</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
};

export default FinancialRecordControls;
