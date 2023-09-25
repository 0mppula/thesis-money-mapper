import { Button, ButtonProps } from '@/components/ui/button';
import React from 'react';
import { IconType } from 'react-icons';
import { ImSpinner8 } from 'react-icons/im';

interface ButtonWithIconProps extends ButtonProps {
	children?: React.ReactNode;
	icon?: IconType;
	loading?: boolean;
}

export function ButtonWithIcon({ icon: Icon, loading, children, ...props }: ButtonWithIconProps) {
	return (
		<Button {...props} disabled={loading || props.disabled}>
			{children}{' '}
			{loading ? (
				<ImSpinner8 className="ml-2 h-4 w-4 animate-spin" />
			) : Icon ? (
				<Icon className="ml-2 h-4 w-4" />
			) : (
				<></>
			)}
		</Button>
	);
}
