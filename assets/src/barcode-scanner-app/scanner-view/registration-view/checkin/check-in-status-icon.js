/**
 * External imports
 */
import { Dashicon } from '@wordpress/components';

/**
 * Internal imports
 */
import { getCheckInIconString } from './get-check-in-status-configuration';

const CheckInStatusIcon = ( { checkinEntity } ) => {
	return <Dashicon icon={ getCheckInIconString( checkinEntity ) } />;
};

export default CheckInStatusIcon;
