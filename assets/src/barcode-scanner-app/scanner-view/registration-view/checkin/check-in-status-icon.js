/**
 * External imports
 */
import { Dashicon } from '@wordpress/components';

/**
 * Internal imports
 */
import { getCheckInIconString } from './get-check-in-status-configuration';

const CheckInStatusIcon = ( { checkin } ) => {
	return <Dashicon icon={ getCheckInIconString( checkin ) } />;
};

export default CheckInStatusIcon;
