/**
 * External imports
 */
import { checkInModel } from '@eventespresso/model';
import { isModelEntityOfModel } from '@eventespresso/validators';
import { sprintf } from '@eventespresso/i18n';
import memize from 'memize';
import { __ } from '@wordpress/i18n';

const getCheckInStatusConfiguration = ( checkInEntity ) => {
	const status = isModelEntityOfModel( checkInEntity, 'checkin' ) ?
		checkInEntity.in :
		checkInModel.CHECKIN_STATUS_ID.STATUS_CHECKED_NEVER;
	let checkInStatusText,
		checkInActionText,
		checkInClassName,
		checkInIcon,
		checkInIconClassName;
	switch ( status ) {
		case checkInModel.CHECKIN_STATUS_ID.STATUS_CHECKED_NEVER:
			checkInStatusText = __(
				'Has not been checked in yet.',
				'event_espresso'
			);
			checkInActionText = __( 'Check In', 'event_espresso' );
			checkInClassName = 'ee-green';
			checkInIconClassName = 'ee-red';
			checkInIcon = 'no-alt';
			break;
		case checkInModel.CHECKIN_STATUS_ID.STATUS_CHECKED_IN:
			checkInStatusText = sprintf(
				__( 'Last checked in on %s', 'event_espresso' ),
				checkInEntity.timestamp
			);
			checkInActionText = __( 'Check Out', 'event_espresso ' );
			checkInClassName = 'ee-red';
			checkInIconClassName = 'ee-green';
			checkInIcon = 'yes';
			break;
		case checkInModel.CHECKIN_STATUS_ID.STATUS_CHECKED_OUT:
			checkInStatusText = sprintf(
				__( 'Last checked out on %s', 'event_espresso' ),
				checkInEntity.timestamp
			);
			checkInActionText = __( 'Check In', 'event_espresso ' );
			checkInClassName = 'ee-green';
			checkInIconClassName = 'ee-red';
			checkInIcon = 'no-alt';
			break;
		default:
			checkInStatusText = __(
				'Has access to datetime, but not approved.',
				'event_espresso'
			);
			checkInActionText = __( 'Check In Anyways', 'event_espresso ' );
			checkInClassName = 'ee-yellow';
			checkInIconClassName = 'ee-red';
			checkInIcon = 'no-alt';
			break;
	}
	return {
		checkInStatusText,
		checkInActionText,
		checkInClassName,
		checkInIcon,
		checkInIconClassName,
	};
};

export const getCheckInStatusText = memize( ( checkInEntity ) => {
	return getCheckInStatusConfiguration( checkInEntity ).checkInStatusText;
} );

export const getCheckInActionText = memize( ( checkInEntity ) => {
	return getCheckInStatusConfiguration( checkInEntity ).checkInActionText;
} );

export const getCheckInClassName = memize( ( checkInEntity ) => {
	return getCheckInStatusConfiguration( checkInEntity ).checkInClassName;
} );

export const getCheckInIconString = memize( ( checkInEntity ) => {
	return getCheckInStatusConfiguration( checkInEntity ).checkInIcon;
} );

export const getCheckInIconClassName = memize( ( checkInEntity ) => {
	return getCheckInStatusConfiguration( checkInEntity ).checkInIconClassName;
} );
