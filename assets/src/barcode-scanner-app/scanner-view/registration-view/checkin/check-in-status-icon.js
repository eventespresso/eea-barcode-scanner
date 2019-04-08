/**
 * External imports
 */
import { Dashicon } from '@wordpress/components';
import PropTypes from 'prop-types';

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

CheckInStatusIcon.propTypes = { checkinEntity: PropTypes.object };
CheckInStatusIcon.defaultProps = { checkinEntity: null };

export default CheckInStatusIcon;
