/**
 * External imports
 */
import { Map } from 'immutable';
import { combineReducers } from '@wordpress/data';

export function isVisibleGroup( state = Map(), action ) {
	return action.type === 'TOGGLE_IS_VISIBLE_GROUP' ?
		state.set( action.registrationId, action.isVisible ) :
		state;
}

export default combineReducers( {
	isVisibleGroup,
} );
