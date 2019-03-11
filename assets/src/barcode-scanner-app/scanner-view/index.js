/**
 * External imports
 */
import { Component } from '@wordpress/element';
import { withDispatch } from '@wordpress/data';

/**
 * Internal imports
 */
import AllRegistrationLink from './all-registration-link';
import ScanInputView from './scan-input-view';
import { scanTypes } from './scan-input-view/scan-type-selector';
import { __ } from '@eventespresso/i18n';
import RegistrationView from './registration-view';

export class ScannerView extends Component {
	state = {
		registrationCode: '',
		scanTypeSelection: scanTypes.LOOKUP,
	};

	onScannerComplete = ( inputEvent, data ) => {
		this.setRegistrationCode( data.string );
		this.props.createSuccess(
			__( 'Successfully scanned', 'event_espresso' )
		);
	};

	onScannerError = () => {
		this.props.createError(
			__( 'There was an error with the input.', 'event_espresso' )
		);
	};

	onScannerReceive = ( inputEvent ) => {
		// todo: nothing needs to happen at this point unless we want to start
		// showing the indicator that things are working?  Maybe a scanner icon?
	};

	onScanTypeSelect = ( selectedValue ) => {
		this.setRegistrationCode( '' );
		this.setScanTypeSelection( selectedValue.value );
	};

	onManualInput = ( registrationCode ) => {
		this.setRegistrationCode( registrationCode );
	};

	setRegistrationCode( registrationCode ) {
		this.setState( { registrationCode } );
	}

	setScanTypeSelection( scanTypeSelection ) {
		this.setState( { scanTypeSelection } );
	}

	render() {
		const registrationView =
			this.state.scanType !== scanTypes.LOOKUP &&
			this.state.registrationCode ?
				<RegistrationView
					DTT_ID={ this.props.DTT_ID }
					registrationCode={ this.state.registrationCode }
				/> :
				null;
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
				{ registrationView }
			</div>
		);
	}
};

export default withDispatch( ( dispatch ) => ( {
	createError: dispatch( 'core/notices' ).createErrorNotice,
	createSuccess: dispatch( 'core/notices' ).createSuccess,
} ) )( ScannerView );
