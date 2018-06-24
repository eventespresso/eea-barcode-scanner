/**
 * External Imports
 */
import { Component } from 'react';

export default class RegistrationDetailsView extends Component {
	render() {
		return (
			<div>
				<ContactDetails />
				<AvatarImage />
				<RegistrationActionsView />
			</div>
		)
	}
}