/**
 * External imports.
 */
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { withDispatch } from '@wordpress/data';
import classnames from 'classnames';

const ToggleCheckinForAllRegistrationsButton = ( { toggleCheckinsAction } ) => {
	const classes = classnames( 'ee-button', 'ee-green', 'ee-roundish' );
	return <Button onClick={ toggleCheckinsAction } className={ classes }>
		{ __( 'Checkin All Registrations', 'event_espresso' ) }
	</Button>;
};

export default withDispatch( (
	dispatch,
	ownProps,
	{ select }
) => {
	const toggleCheckinsAction = () => {
		const { registration, datetimeId } = ownProps;
		const { getEntities } = select( 'eventespresso/core' );
		const { toggleLatestCheckin } = dispatch( 'eventespresso/core' );
		const groupRegistrations = getEntities( 'registration' ).filter(
			( registrationEntity ) => registrationEntity.id !== registration.id
		);
		if ( groupRegistrations ) {
			groupRegistrations.forEach( ( registrationEntity ) => {
				toggleLatestCheckin( registrationEntity, datetimeId );
			} );
		}
	};
	return { toggleCheckinsAction };
} )( ToggleCheckinForAllRegistrationsButton );
