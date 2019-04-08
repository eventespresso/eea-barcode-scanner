/**
 * External imports.
 */
import { isModelEntityOfModel } from '@eventespresso/validators';
import PropTypes from 'prop-types';

const CheckInTimestamp = ( { checkinEntity } ) => {
	if ( ! isModelEntityOfModel( checkinEntity, 'checkin' ) ) {
		return null;
	}
	return <span className={ 'checkin-timestamp' }>
		{ checkinEntity.timestamp.toFormat() }
	</span>;
};

CheckInTimestamp.propTypes = { checkinEntity: PropTypes.object };
CheckInTimestamp.defaultProps = { checkinEntity: null };

export default CheckInTimestamp;
