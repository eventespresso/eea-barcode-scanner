/**
 * External imports.
 */
import { Button } from '@wordpress/components';

import {
	getCheckInActionText,
	getCheckInClassName,
} from './get-check-in-status-configuration';

export function CheckInButton( {
	checkIn,
	onClick,
} ) {
	const buttonText = getCheckInActionText( checkIn );
	const cssClass = getCheckInClassName( checkIn );
	return <Button onClick={ onClick } className={ cssClass }>
		{ buttonText }
	</Button>;
}
