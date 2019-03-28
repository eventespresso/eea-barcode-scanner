export function isGroupVisible( state, registrationId ) {
	return state.isVisibleGroup.get( registrationId, false );
}

export function getMainRegistrationId( state ) {
	return state.mainRegistrationId || 0;
}
