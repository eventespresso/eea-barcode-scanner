/**
 * External imports
 */
import { Component } from 'react';

export default class ScannerView extends Component {
	render() {
		return (
			<div className={ 'eea-bs-scanner-view-container' }>
				<AllRegistrationLink />
				<ScanInputView />
				<RegistrationView />
			</div>
		);
	}
};
