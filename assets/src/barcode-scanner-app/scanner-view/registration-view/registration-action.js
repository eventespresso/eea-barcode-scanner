/**
 * External Imports
 */
import { Component } from 'react';
import { __, sprintf } from '@eventespresso/i18n';
import { checkInModel } from '@eventespresso/model';

/**
 * Internal Imports
 */
import { TextBubble } from '../../../components/ui/enhanced-text';

const getCheckInStatusConfiguration = ( checkInEntity ) => {
	const status = checkInEntity !== null ?
		checkInEntity.CHK_in :
		checkInModel.CHECKIN_STATUS_ID.STATUS_CHECKED_NEVER;
	let checkInStatusText, checkInButtonText, checkInClassName;
	switch ( status ) {
		case checkInModel.CHECKIN_STATUS_ID.STATUS_CHECKED_NEVER:
			checkInStatusText = __(
				'Has not been checked in yet.',
				'event_espresso'
			);
			checkInButtonText = __( 'Check In', 'event_espresso' );
			checkInClassName = 'ee-green';
			break;
		case checkInModel.CHECKIN_STATUS_ID.STATUS_CHECKED_IN:
			checkInStatusText = sprintf(
				__( 'Last checked in on %s', 'event_espresso' ),
				checkInEntity.CHK_timestamp
			);
			checkInButtonText = __( 'Check Out', 'event_espresso ');
			checkInClassName = 'ee-red';
			break;
		case checkInModel.CHECKIN_STATUS_ID.STATUS_CHECKED_OUT:
			checkInStatusText = sprintf(
				__( 'Last checked out on %s', 'event_espresso' ),
				checkInEntity.CHK_timestamp
			);
			checkInButtonText = __( 'Check In', 'event_espresso ');
			checkInClassName = 'ee-green';
			break;
		default:
			checkInStatusText = __(
				'Has access to datetime, but not approved.',
				'event_espresso'
			);
			checkInButtonText = __( 'Check In Anyways', 'event_espresso ');
			checkInClassName = 'ee-yellow';
			break;
	}
	return {
		checkInStatusText,
		checkInButtonText,
		checkInClassName,
	};
};

export default class RegistrationAction extends Component {
	render() {
		const { checkIn } = this.props;
		const {
			checkinStatusText,
			checkInButtonText,
			checkInClassName,
		} = getCheckInStatusConfiguration( checkIn );
		return (
			<div>
				<TextBubble>
					{ checkInStatusText }
				</TextBubble>
				<Button className={ checkInClassName }/>
			</div>
		);
	}
}
