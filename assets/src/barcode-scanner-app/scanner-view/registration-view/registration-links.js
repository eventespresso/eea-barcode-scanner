/**
 * External imports
 */
import { isModelEntityOfModel } from '@eventespresso/validators';
import { routes } from '@eventespresso/eejs';
import { withDispatch, withSelect } from '@wordpress/data';
import { sprintf, __ } from '@wordpress/i18n';
import { Button, ExternalLink } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { compose } from '@wordpress/compose';

export function RegistrationLinks( {
	registration = null,
	onViewGroupClick,
	isGroupVisible = false,
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
		const buttonText = isGroupVisible ?
			sprintf(
				__( 'Hide Group (%d)', 'event_espresso' ),
				registration.groupSize - 1
			) :
			sprintf(
				__( 'Show Group (%d)', 'event_espresso' ),
				registration.groupSize - 1
			);
		return <Button onClick={ onViewGroupClick } isSmall={ true }>
			{ buttonText }
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
		<ExternalLink href={ getRegistrationDetailsLink() }>
			{ __( 'View Registration Details', 'event_espresso' ) }
		</ExternalLink> |
		<ExternalLink href={ getContactDetailsLink() }>
			{ __( 'View Contact Details', 'event_espresso' ) }
		</ExternalLink>
		{ getGroupToggle() }
	</div>;
}

export default compose( [
	withSelect( ( select, { registration } ) => {
		return {
			isGroupVisible: select( 'eea-barcode-scanner/core' )
				.isGroupVisible( registration.id ),
		};
	} ),
	withDispatch( ( dispatch, { registration }, { select } ) => {
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
	} ),
] )( RegistrationLinks );
