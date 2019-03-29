/**
 * External imports.
 */
import { Button } from '@wordpress/components';
import classnames from 'classnames';

import {
	getCheckInActionText,
	getCheckInClassName,
} from './get-check-in-status-configuration';

export function CheckInButton( {
	checkinEntity,
	onClick,
} ) {
	const buttonText = getCheckInActionText( checkinEntity );
	const cssClass = classnames(
		getCheckInClassName( checkinEntity ),
		'ee-button',
		'ee-roundish'
	);
	return <Button onClick={ onClick } className={ cssClass }>
		{ buttonText }
	</Button>;
}
