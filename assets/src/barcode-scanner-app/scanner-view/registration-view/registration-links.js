/**
 * External imports
 */
import { isModelEntityOfModel } from '@eventespresso/validators';
import { routes } from '@eventespresso/eejs';
import { withDispatch } from '@wordpress/data';
import { sprintf, __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

export function RegistrationLinks( {
	registration = null,
	onViewGroupClick,
} ) {
	const getRegistrationDetailsLink = () => {
		return routes.getAdminUrl(
			routes.ADMIN_ROUTES.REGISTRATIONS,
			'view_registration'
		) + '_REG_ID=' + registration.id;
	};
	const getContactDetailsLink = () => {
		return routes.getAdminUrl(
			routes.ADMIN_ROUTES.REGISTRATIONS,
			'edit_attendee'
		) + 'post=' + registration.attId;
	};
	const getToggleButton = () => {
		return <Button onClick={ onViewGroupClick }>
			{ sprintf( __( 'View Group (%d)', 'event_espresso ' ),
				registration.groupSize
			) }
		</Button>;
	};
	const getGroupToggle = () => {
		return registration.groupSize > 0 ?
			<Fragment> | { getToggleButton() }</Fragment> :
			null;
	};
	if ( ! isModelEntityOfModel( registration, 'registration' ) ) {
		return null;
	}
	return <div className="eea-barcode-registration-links-container">
		<a href={ getRegistrationDetailsLink() }>
			{ __( 'View Registration Details', 'event_espresso' ) }
		</a> |
		<a href={ getContactDetailsLink() }>
			{ __( 'View Contact Details', 'event_espresso' ) }
		</a>
		{ getGroupToggle() }
	</div>;
}

export default withDispatch( ( dispatch, ownProps, { select } ) => {
	const { registration } = ownProps;
	const { toggleIsVisibleGroup } = dispatch( 'eea-barcode-scanner/core' );
	const { isGroupVisible } = select( 'eea-barcode-scanner/core' );
	return {
		onViewGroupClick: () => {
			if (
				isModelEntityOfModel( registration, 'registration' )
			) {
				const visibleGroup = isGroupVisible( registration.id );
				toggleIsVisibleGroup( registration.id, ! visibleGroup );
			}
		},
	};
} )( RegistrationLinks );
