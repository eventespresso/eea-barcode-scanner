/**
 * External imports
 */
import { Map } from 'immutable';
import { combineReducers } from '@wordpress/data';

export function isVisibleGroup( state = Map(), action ) {
	switch ( action.type ) {
		case 'TOGGLE_IS_VISIBLE_GROUP':
			return state.set( action.registrationId, action.isVisible );
		case 'RESET_IS_VISIBLE_GROUP_STATE':
		case 'RESET_ALL_STATE':
			return Map();
	}
	return state;
}

export function mainRegistrationId( state = 0, action ) {
	switch ( action.type ) {
		case 'RECEIVE_MAIN_REGISTRATION_ID':
			return action.registrationId;
		case 'RESET_ALL_STATE':
		case 'RESET_MAIN_REGISTRATION_ID':
			return 0;
	}
	return state;
}

export default combineReducers( {
	isVisibleGroup,
	mainRegistrationId,
} );
