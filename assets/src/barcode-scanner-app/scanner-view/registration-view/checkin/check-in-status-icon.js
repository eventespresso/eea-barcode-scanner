/**
 * External imports
 */
import { Dashicon } from '@wordpress/components';
import PropTypes from 'prop-types';

/**
 * Internal imports
 */
import {
	getCheckInStatusIcon,
	getCheckInStatusClassName,
} from './get-check-in-status-configuration';

const CheckInStatusIcon = ( { checkinEntity } ) => {
	return <Dashicon
		className={ getCheckInStatusClassName( checkinEntity ) }
		icon={ getCheckInStatusIcon( checkinEntity ) }
	/>;
};

CheckInStatusIcon.propTypes = { checkinEntity: PropTypes.object };
CheckInStatusIcon.defaultProps = { checkinEntity: null };

export default CheckInStatusIcon;
