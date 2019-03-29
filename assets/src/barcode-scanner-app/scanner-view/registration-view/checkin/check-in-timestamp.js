/**
 * External imports.
 */
import { isModelEntityOfModel } from '@eventespresso/validators';

const CheckInTimestamp = ( { checkinEntity } ) => {
	if ( ! isModelEntityOfModel( checkinEntity, 'checkin' ) ) {
		return null;
	}
	return <span className={ 'checkin-timestamp' }>
		{ checkinEntity.timestamp.toFormat() }
	</span>;
};

export default CheckInTimestamp;
