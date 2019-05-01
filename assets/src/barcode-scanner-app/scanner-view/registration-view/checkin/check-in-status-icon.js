/**
 * External imports
 */
import { Dashicon } from '@wordpress/components';
import PropTypes from 'prop-types';

/**
 * Internal imports
 */
import {
	getCheckinStatusIcon,
	getCheckinStatusClassName,
} from './get-check-in-status-configuration';

const CheckInStatusIcon = ( { checkinEntity } ) => {
	return <Dashicon
		className={ getCheckinStatusClassName( checkinEntity ) }
		icon={ getCheckinStatusIcon( checkinEntity ) }
	/>;
};

CheckInStatusIcon.propTypes = { checkinEntity: PropTypes.object };
CheckInStatusIcon.defaultProps = { checkinEntity: null };

export default CheckInStatusIcon;
