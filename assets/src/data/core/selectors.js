export function isGroupVisible( state, registrationId ) {
	return state.isVisibleGroup.get( registrationId, false );
}
