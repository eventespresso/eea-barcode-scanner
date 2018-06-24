/**
 * External imports
 */
import { Component } from 'react';

/**
 * Internal Imports
 */
import { StatusCircle } from '../../../components/ui/indicators';

export default class RegistrationStatus extends Component {
	render() {
		return (
			<div>
				{ /*text for status stuff*/ }
				<StatusCircle />
			</div>
		);
	}
}
