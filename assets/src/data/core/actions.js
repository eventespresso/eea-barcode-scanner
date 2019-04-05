/**
 * Internal imports
 */
import { dispatch, resolveSelect } from './controls';

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

export function* resetAllState( includeOtherStates = true ) {
	yield {
		type: 'RESET_ALL_STATE',
	};
	if ( includeOtherStates ) {
		yield dispatch(
			'eventespresso/lists',
			'resetEntitiesForModelName',
			'registration'
		);
		yield dispatch(
			'eventespresso/core',
			'resetModelSpecificForSelector',
			'getLatestCheckin'
		);
	}
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
	const registrations = yield resolveSelect(
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
	const registration = registrations.pop();
	yield dispatch(
		'eea-barcode-scanner/core',
		'receiveMainRegistrationId',
		registration.id
	);
	if ( checkInOnly ) {
		const latestCheckin = yield resolveSelect(
			'eventespresso/core',
			'getLatestCheckin',
			registration.id,
			datetimeId
		);
		if (
			latestCheckin.in ===
			checkInModel.CHECKIN_STATUS_ID.STATUS_CHECKED_IN
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
