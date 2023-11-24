import { create } from 'zustand';

interface useCreateFinancialRecordModalStore {
	isOpen: boolean;
	setIsOpen: (state: boolean | ((prevState: boolean) => boolean)) => void;
}

const useCreateFinancialRecordModal = create<useCreateFinancialRecordModalStore>((set) => ({
	isOpen: false,
	setIsOpen: (value) =>
		set((state) =>
			typeof value === 'function' ? { isOpen: value(state.isOpen) } : { isOpen: value }
		),
}));

export default useCreateFinancialRecordModal;
