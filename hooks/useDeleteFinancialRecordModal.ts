import { create } from 'zustand';

interface useDeleteFinancialRecordModalStore {
	isOpen: boolean;
	deletedRecordId: string | null;
	setIsOpen: (state: boolean | ((prevState: boolean) => boolean)) => void;
	setDeletedRecordId: (value: string | null) => void;
}

const useDeleteFinancialRecordModal = create<useDeleteFinancialRecordModalStore>((set) => ({
	isOpen: false,
	deletedRecordId: null,
	setIsOpen: (value) =>
		set((state) =>
			typeof value === 'function' ? { isOpen: value(state.isOpen) } : { isOpen: value }
		),
	setDeletedRecordId: (value) => set(() => ({ deletedRecordId: value })),
}));

export default useDeleteFinancialRecordModal;
