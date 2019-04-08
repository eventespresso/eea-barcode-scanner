/**
 * Internal imports
 */
import CheckInStatusIcon from './check-in-status-icon';

/**
 * External imports
 */
import PropTypes from 'prop-types';

const CheckInResult = ( { checkin } ) => {
	return <div className="check-in-result">
		<CheckInStatusIcon checkinEntity={ checkin } />
	</div>;
};

CheckInResult.propTypes = { checkin: PropTypes.object };
CheckInResult.defaultProps = { checkin: null };

export default CheckInResult;
