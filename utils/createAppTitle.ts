import { appTitle } from '@/constants';

export default function createAppTitle(pageName: string) {
	return `${pageName} – ${appTitle}`;
}
