/**
 * External imports
 */
import { Component } from 'react';

export default class RegistrationView extends Component {
	render() {
		return (
			<div className={ 'eea-barcode-scanning-results' }>
				<RegistrationDetailsView />
				<RegistrationGroupView />
				<Button />
			</div>
		);
	}
}
