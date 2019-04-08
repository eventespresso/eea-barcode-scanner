/**
 * External Imports
 */
import { AvatarImage } from '@eventespresso/components';
import { isModelEntityOfModel } from '@eventespresso/validators';
import warning from 'warning';
import { ifCondition } from '@wordpress/compose';
import PropTypes from 'prop-types';

/**
 * Internal Imports
 */
import ContactDetails from './contact-details';
import RegistrationActionsView from './registration-actions-view';

function getAttendeeName( attendee ) {
	return `${ attendee.fname } ${ attendee.lname }`;
}

function RegistrationDetailsView( {
	attendee,
	registration,
	DTT_ID,
} ) {
	return (
		<div className={ 'eea-bs-registration-details-container' }>
			<ContactDetails
				fullName={ getAttendeeName( attendee ) }
				email={ attendee.email }
			/>
			<AvatarImage
				avatarUrl={ attendee.userAvatar }
				avatarHeight={ 128 }
				avatarWidth={ 128 }
			/>
			<RegistrationActionsView
				registration={ registration }
				DTT_ID={ DTT_ID }
			/>
		</div>
	);
}

RegistrationDetailsView.propTypes = {
	attendee: PropTypes.object.isRequired,
	registration: PropTypes.object.isRequired,
	DTT_ID: PropTypes.number.isRequired,
};

const WrappedComponent = ifCondition(
	( { attendee, registration } ) => {
		if (
			! isModelEntityOfModel( attendee, 'attendee' )
		) {
			warning(
				false,
				'The provided attendee prop is not an instance of BaseEntity ' +
				'for the attendee model'
			);
			return false;
		}
		if (
			! isModelEntityOfModel( registration, 'registration' )
		) {
			warning(
				false,
				'The provided registration prop is not an instance of ' +
				'BaseEntity for the registration model'
			);
			return false;
		}
		return true;
	}
)( RegistrationDetailsView );

WrappedComponent.propTypes = {
	registration: PropTypes.object,
	attendee: PropTypes.object,
	DTT_ID: PropTypes.number,
};

WrappedComponent.defaultProps = {
	registration: null,
	attendee: null,
	DTT_ID: 0,
};

export default WrappedComponent;
