import PageContainer from '@/components/PageContainer';
import { TypographyH1 } from '@/components/TypographyH1';
import { mainAppDescription } from '@/constants';
import createAppTitle from '@/utils/createAppTitle';
import { Metadata } from 'next';
import Charts from './components/Charts';

export const metadata: Metadata = {
	title: createAppTitle('Dashboard'),
	description: mainAppDescription,
};

const Page = () => {
	return (
		<PageContainer>
			<TypographyH1 center>Dashboard</TypographyH1>

			<Charts />
		</PageContainer>
	);
};

export default Page;
