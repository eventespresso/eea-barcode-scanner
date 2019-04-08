/**
 * External imports.
 */
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { withDispatch } from '@wordpress/data';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { isModelEntityOfModel } from '@eventespresso/validators';

const ToggleCheckinForAllRegistrationsButton = ( { toggleCheckinsAction } ) => {
	const classes = classnames( 'ee-button', 'ee-green', 'ee-roundish' );
	return <Button onClick={ toggleCheckinsAction } className={ classes }>
		{ __( 'Checkin All Registrations', 'event_espresso' ) }
	</Button>;
};

ToggleCheckinForAllRegistrationsButton.propTypes = {
	toggleCheckinsAction: PropTypes.func,
};

ToggleCheckinForAllRegistrationsButton.defaultProps = {
	toggleCheckinsAction: () => null,
}

const WrappedToggleCheckinForAllRegistrationsButton = withDispatch( (
	dispatch,
	{ registration, datetimeId },
	{ select }
) => {
	const toggleCheckinsAction = () => {
		if ( ! isModelEntityOfModel( registration, 'registration' ) ) {
			return;
		}
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

WrappedToggleCheckinForAllRegistrationsButton.propTypes = {
	registration: PropTypes.object,
	datetimeId: PropTypes.number,
};

WrappedToggleCheckinForAllRegistrationsButton.defaultProps = {
	registration: null,
	datetimeId: 0,
};

export default WrappedToggleCheckinForAllRegistrationsButton;
