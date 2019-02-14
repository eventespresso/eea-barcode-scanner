/**
 * External imports
 */
import { Component } from '@wordpress/element';

/**
 * Internal imports
 */
import AllRegistrationLink from './all-registration-link';
import ScanInputView from './scan-input-view';
import { scanTypes } from './scan-input-view/scan-type-selector';

export default class ScannerView extends Component {
	state = {
		registrationCode: '',
		scanTypeSelection: scanTypes.LOOKUP,
	};

	onScannerComplete = ( event, data ) => {
		this.setRegistrationCode( data.string );
	};

	onScannerError = ( event, data ) => {
		// todo: data.string will be the string being written when there is
		// an error.  I need to have a component for displaying notices/errors.
	};

	onScannerReceive = event => {
		// todo: nothing needs to happen at this point unless we want to start
		// showing the indicator that things are working?  Maybe a scanner icon?
	};

	onScanTypeSelect = selectedValue => {
		this.setRegistrationCode( '' );
		this.setScanTypeSelection( selectedValue.value );
	};

	onManualInput = registrationCode => {
		this.setRegistrationCode( registrationCode );
	};

	setRegistrationCode( registrationCode ) {
		this.setState( { registrationCode } );
	}

	setScanTypeSelection( scanTypeSelection ) {
		this.setState( { scanTypeSelection } );
	}

	render() {
		return (
			<div className={ 'eea-bs-scanner-view-container' }>
				<AllRegistrationLink
					DTT_ID={ this.props.DTT_ID }
					EVT_ID={ this.props.EVT_ID }
				/>
				<ScanInputView
					onScannerComplete={ this.onScannerComplete }
					onScannerError={ this.onScannerError }
					onScannerReceive={ this.onScannerReceive }
					onScanTypeSelect={ this.onScanTypeSelect }
					scanTypeSelection={ this.state.scanTypeSelection }
					registrationCode={ this.state.registrationCode }
					onManualInput={ this.onManualInput }
				/>
				{ /* Todo: This view will only appear for lookup type searches */ }
				<RegistrationView />
			</div>
		);
	}
};
