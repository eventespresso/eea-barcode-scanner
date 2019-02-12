/**
 * External Imports
 */
import { Component } from 'react';
import { AvatarImage } from '@eventespresso/components';

/**
 * Internal Imports
 */
import ContactDetails from './contact-details';

export default class RegistrationDetailsView extends Component {

	getAttendeeName() {
		return `${ this.props.attendee.ATT_fname } ${ this.props.attendee.ATT_lname }`;
	}

	render() {
		return (
			<div className={ 'eea-bs-registration-details-container' }>
				<ContactDetails
					fullName={ this.getAttendeeName() }
					email={ this.props.attendee.ATT_email }
				/>
				<AvatarImage
					avatarUrl={ this.props.attendee.avatarUrl }
					avatarHeight={ 128 }
					avatarWidth={ 128 }
				/>
				<RegistrationActionsView />
			</div>
		);
	}
}