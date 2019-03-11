/**
 * External imports
 */
import { isModelEntityOfModel } from '@eventespresso/validators';
import { compose } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';
import { registrationModel } from '@eventespresso/model';
import { routes } from '@eventespresso/eejs';
import { sprintf, __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';

const DEFAULT_EMPTY_ARRAY = [];

export function RegistrationLinks( {
	registration = null,
	onViewClick,
	groupSize = 0,
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
	const getGroupSizeToggle = () => {
		if ( groupSize > 0 ) {
			return (
				' | ' + <Button onClick={ onViewClick }>
					{ sprintf(
						__( 'View Group (%d)', 'event_espresso' ),
						groupSize
					) }
				</Button>
			);
		}
		return '';
	};
	if ( ! isModelEntityOfModel( registration ) ) {
		return null;
	}
	return <div className="eea-barcode-registration-links-container">
		<a href={ getRegistrationDetailsLink() }>
			{ __( 'View Registration Details', 'event_espresso' ) }
		</a> |
		<a href={ getContactDetailsLink() }>
			{ __( 'View Contact Details', 'event_espresso' ) }
		</a>
		{ getGroupSizeToggle() }
	</div>;
}

export default compose( [
	withSelect( ( select, ownProps ) => {
		const { registration } = ownProps;
		const { getEntities } = select( 'eventespresso/core' );
		const groupRegistrations = isModelEntityOfModel(
			registration,
			'registration'
		) && registration.groupSize < 2 ?
			getEntities(
				'registration',
				registrationModel.getQueryString(
					{
						orderBy: 'reg_id',
						forTransactionId: registration.txnId,
						forTicketId: registration.tktId,
					}
				) + '&[where][REG_ID][!=]=' + registration.id
			) :
			DEFAULT_EMPTY_ARRAY;
		return { groupSize: groupRegistrations.length };
	} ),
	withDispatch( ( dispatch, ownProps, { select } ) => {
		const { registration } = ownProps;
		const { toggleIsVisibleGroup } = dispatch( 'eea-barcode-scanner/core' );
		const { isGroupVisible } = select( 'eea-barcode-scanner/core' );
		return {
			onViewGroupClick: () => {
				if (
					isModelEntityOfModel( registration, 'registration' )
				) {
					const visibleGroup = isGroupVisible( registration.id );
					dispatch( toggleIsVisibleGroup( ! visibleGroup ) );
				}
			},
		};
	} ),
] )( RegistrationLinks );
