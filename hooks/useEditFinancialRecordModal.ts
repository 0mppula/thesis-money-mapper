import { creationSchema } from '@/schemas/financialRecord';
import { z } from 'zod';
import { create } from 'zustand';

interface useEditFinancialRecordModalStore {
	isOpen: boolean;
	editedRecord: z.infer<typeof creationSchema> | null;
	editedRecordId: string | null;
	setIsOpen: (state: boolean | ((prevState: boolean) => boolean)) => void;
	setEditedRecord: (value: z.infer<typeof creationSchema> | null) => void;
	setEditedRecordId: (value: string | null) => void;
}

const useEditFinancialRecordModal = create<useEditFinancialRecordModalStore>((set) => ({
	isOpen: false,
	editedRecord: null,
	editedRecordId: null,
	setIsOpen: (value) =>
		set((state) =>
			typeof value === 'function' ? { isOpen: value(state.isOpen) } : { isOpen: value }
		),
	setEditedRecord: (value) => set(() => ({ editedRecord: value })),
	setEditedRecordId: (value) => set(() => ({ editedRecordId: value })),
}));

export default useEditFinancialRecordModal;
