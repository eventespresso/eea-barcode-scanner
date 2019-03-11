export function toggleIsVisibleGroup( registrationId, isVisible ) {
	return {
		type: 'TOGGLE_IS_VISIBLE_GROUP',
		registrationId,
		isVisible,
	};
}
