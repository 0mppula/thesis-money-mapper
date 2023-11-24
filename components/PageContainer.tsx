import React from 'react';

interface PageContainerProps {
	children: React.ReactNode;
}

const PageContainer = ({ children }: PageContainerProps) => {
	return (
		<div className="container max-w-7xl pt-8 pb-20 md:pt-12 min-h-[calc(100vh-69px)]">
			{children}
		</div>
	);
};

export default PageContainer;
