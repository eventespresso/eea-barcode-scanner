import { withDispatch } from '@wordpress/data';
import {
	createHigherOrderComponent,
	compose,
	withState,
} from '@wordpress/compose';

import { NOTICE_ID_TOGGLE_CHECKIN_ERROR } from './constants';

export const CHECKIN_STATES = {
	IDLE: 0,
	LOADING: 1,
	CHECKED_IN: 2,
	CHECKED_OUT: 3,
	ERROR: 4,
};

const withCheckinState = createHigherOrderComponent( compose( [
	withState( { checkinState: CHECKIN_STATES.IDLE } ),
	withDispatch( ( dispatch, { setState } ) => {
		let checkinState;
		const { toggleCheckInState } = dispatch( 'eea-barcode-scanner/core' );
		async function toggleCheckin( registrationCode, datetimeId, checkInOnly ) {
			if ( ! registrationCode || ! datetimeId ) {
				return;
			}
			setState( { checkinState: CHECKIN_STATES.LOADING } );
			try {
				checkinState = await toggleCheckInState(
					registrationCode,
					datetimeId,
					checkInOnly
				);
				setState( { checkinState } );
			} catch ( e ) {
				dispatch( 'core/notices' ).createErrorNotice(
					e.message,
					{
						id: NOTICE_ID_TOGGLE_CHECKIN_ERROR,
					}
				);
				setState( { checkinState: CHECKIN_STATES.ERROR } );
			}
		}
		function resetCheckinState() {
			setState( { checkinState: CHECKIN_STATES.IDLE } );
		}
		return { toggleCheckin, resetCheckinState };
	} ),
] ), 'withCheckinState' );

export default withCheckinState;
