/**
 * External imports.
 */
import { isModelEntityOfModel } from '@eventespresso/validators';

const CheckInTimestamp = ( { checkin } ) => {
	if ( ! isModelEntityOfModel( checkin, 'checkin' ) ) {
		return null;
	}
	return <span className={ 'checkin-timestamp' }>
		{ checkin.timestamp.toFormat() }
	</span>;
};

export default CheckInTimestamp;
