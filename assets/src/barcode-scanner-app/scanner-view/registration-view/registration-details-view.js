/**
 * External Imports
 */
import { AvatarImage } from '@eventespresso/components';
import { isModelEntityOfModel } from '@eventespresso/validators';
import warning from 'warning';

/**
 * Internal Imports
 */
import ContactDetails from './contact-details';
import RegistrationActionsView from './registration-actions-view';

function getAttendeeName( attendee ) {
	return `${ attendee.fname } ${ attendee.lname }`;
}

export default function RegistrationDetailsView( {
	attendee,
	registration,
	DTT_ID,
} ) {
	if (
		! isModelEntityOfModel( attendee, 'attendee' )
	) {
		warning(
			false,
			'The provided attendee prop is not an instance of BaseEntity ' +
			'for the attendee model'
		);
		return null;
	}
	if (
		! isModelEntityOfModel( registration, 'registration' )
	) {
		warning(
			false,
			'The provided registration prop is not an instance of ' +
			'BaseEntity for the registration model'
		);
		return null;
	}

	return (
		<div className={ 'eea-bs-registration-details-container' }>
			<ContactDetails
				fullName={ getAttendeeName( attendee ) }
				email={ attendee.email }
			/>
			<AvatarImage
				avatarUrl={ attendee.avatarUrl }
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
