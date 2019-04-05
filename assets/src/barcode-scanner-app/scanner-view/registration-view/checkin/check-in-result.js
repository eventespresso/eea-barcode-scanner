/**
 * Internal imports
 */
import CheckInStatusIcon from './check-in-status-icon';

export default function CheckInResult( { checkin } ) {
	return <div className="check-in-result">
		<CheckInStatusIcon checkinEntity={ checkin } />
	</div>;
}
