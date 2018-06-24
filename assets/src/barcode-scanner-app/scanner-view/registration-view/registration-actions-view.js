/**
 * External Imports
 */
import { Component } from 'react';

export default class RegistrationActionsView extends Component {
	render() {
		return (
			<div>
				<RegistrationOwing />
				<RegistrationStatus />
				<RegistrationAction />
				<RegistrationLinks />
			</div>
		)
	}
}