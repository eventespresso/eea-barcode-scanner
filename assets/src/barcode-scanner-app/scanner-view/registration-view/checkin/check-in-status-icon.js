/**
 * External imports
 */
import { Dashicon } from '@wordpress/components';

/**
 * Internal imports
 */
import {
	getCheckInIconString,
	getCheckInIconClassName,
} from './get-check-in-status-configuration';

const CheckInStatusIcon = ( { checkinEntity } ) => {
	return <Dashicon
		className={ getCheckInIconClassName( checkinEntity ) }
		icon={ getCheckInIconString( checkinEntity ) }
	/>;
};

export default CheckInStatusIcon;
