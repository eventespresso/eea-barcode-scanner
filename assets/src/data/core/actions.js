/**
 * Internal imports
 */
import { select, dispatch } from './controls';

/**
 * External imports
 */
import { __ } from '@wordpress/i18n';
import { checkInModel } from '@eventespresso/model';

export function toggleIsVisibleGroup( registrationId, isVisible ) {
	return {
		type: 'TOGGLE_IS_VISIBLE_GROUP',
		registrationId,
		isVisible,
	};
}

export function receiveMainRegistrationId( registrationId ) {
	return {
		type: 'RECEIVE_MAIN_REGISTRATION_ID',
		registrationId,
	};
}

export function resetAllState() {
	return {
		type: 'RESET_ALL_STATE',
	};
}

export function resetMainRegistrationId() {
	return {
		type: 'RESET_MAIN_REGISTRATION_ID',
	};
}

export function resetVisibleGroupState() {
	return {
		type: 'RESET_IS_VISIBLE_GROUP_STATE',
	};
}

export function* toggleCheckInState(
	registrationCode,
	datetimeId,
	checkInOnly = false
) {
	const registrations = yield select(
		'eventespresso/lists',
		'getEntities',
		'registration',
		'where[REG_code]=' + registrationCode
	);
	if ( ! registrations || registrations.length === 0 ) {
		throw new Error(
			__(
				'There is no registration for the given registration code',
				'event_espresso'
			)
		);
	}
	const registration = registrations.slice( 0, 1 );
	yield dispatch(
		'eea-barcode-scanner/core',
		'receiveMainRegistrationId',
		registration.id
	);
	if ( checkInOnly ) {
		const latestCheckin = yield select(
			'eventespresso/core',
			'getLatestCheckin',
			registration.id,
			datetimeId,
		);
		if (
			latestCheckin.in ===
			checkInModel.CHECKIN_STATUS_ID.STATUS_CHECKED_OUT
		) {
			throw new Error(
				__(
					'The given registration has already been checked in',
					'event_espresso'
				)
			);
		}
	}
	const newCheckin = yield dispatch(
		'eventespresso/core',
		'toggleCheckin',
		registration.id,
		datetimeId,
	);
	return newCheckin !== null ? newCheckin.in : 0;
}
