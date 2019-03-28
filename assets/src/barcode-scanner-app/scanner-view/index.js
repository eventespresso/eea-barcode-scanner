/**
 * External imports
 */
import { Component } from '@wordpress/element';
import { withDispatch, withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { routes } from '@eventespresso/eejs';

/**
 * Internal imports
 */
import AllRegistrationLink from './all-registration-link';
import ScanInputView from './scan-input-view';
import { scanTypes } from './scan-input-view/scan-type-selector';
import { __ } from '@wordpress/i18n';
import RegistrationView from './registration-view';
import {
	withCheckinState,
	CHECKIN_STATES,
	CheckInResult,
} from './registration-view/checkin';

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
		this.triggerToggleCheckin();
	};

	onScannerError = () => {
		// @todo not quite sure what produces an error so not doing anything here
		// yet. (seems it fires all the time when no scanner is hooked up).
	};

	/**
	 * @todo this receives an inputEvent, just not including for now until
	 * I figure out what to do here.
	 */
	onScannerReceive = () => {
		// todo: nothing needs to happen at this point unless we want to start
		// showing the indicator that things are working?  Maybe a scanner icon?
	};

	onScanTypeSelect = ( selectedValue ) => {
		this.setRegistrationCode( '' );
		this.setScanTypeSelection( selectedValue.value );
	};

	onManualInput = ( registrationCode ) => {
		if ( this.state.scanTypeSelection === scanTypes.SEARCH ) {
			// redirect to registrations page.
			// @todo eventually we could have the search results right on the
			// same page and thus it could be done as a part of the app.
			this.redirect( registrationCode );
			return;
		}
		this.setRegistrationCode( registrationCode );
		this.triggerToggleCheckin();
	};

	resetState = () => {
		this.props.resetStoreState();
		this.props.resetCheckinState();
	};

	triggerToggleCheckin() {
		if (
			this.state.scanTypeSelection === scanTypes.LOOKUP ||
			this.state.scanTypeSelection === scanTypes.SEARCH
		) {
			return;
		}
		this.props.toggleCheckin(
			this.state.registrationCode,
			this.props.DTT_ID,
			this.scanTypeSelection === scanTypes.TOGGLE_NO_CHECKOUT
		);
	}

	redirect( registrationCode ) {
		const parts = this.props.EVT_ID && this.props.DTT_ID ?
			'&event_id=' + this.props.EVT_ID +
			'&DTT_ID=' + this.props.DTT_ID +
			'&s=' + registrationCode :
			'&s=' + registrationCode;
		window.location.href = routes.getAdminUrl(
			routes.ADMIN_ROUTES.REGISTRATIONS,
			routes.ADMIN_ROUTE_ACTIONS.REGISTRATIONS.EVENT_CHECKIN
		) + parts;
	}

	setRegistrationCode( registrationCode ) {
		this.resetState();
		this.setState( { registrationCode } );
	}

	setScanTypeSelection( scanTypeSelection ) {
		this.setState( { scanTypeSelection } );
	}

	getCheckinView() {
		if (
			this.state.scanTypeSelection === scanTypes.LOOKUP &&
			this.state.registrationCode
		) {
			return <RegistrationView
				DTT_ID={ this.props.DTT_ID }
				registrationCode={ this.state.registrationCode }
			/>;
		}
		if ( this.props.checkinState === CHECKIN_STATES.IDLE ) {
			return null;
		}
		return <CheckInResult checkin={ this.props.checkin } />;
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
				{ this.getCheckinView() }
			</div>
		);
	}
}

export default compose( [
	withSelect( ( select, ownProps ) => {
		const hasCheckInState = ( checkinState ) => {
			return checkinState !== CHECKIN_STATES.IDLE &&
				checkinState !== CHECKIN_STATES.ERROR &&
				checkinState !== CHECKIN_STATES.LOADING;
		};
		const { DTT_ID, checkinState } = ownProps;
		const { getLatestCheckin } = select( 'eventespresso/core' );
		const { getMainRegistrationId } = select( 'eea-barcode-scanner/core' );
		const mainRegistrationId = hasCheckInState( checkinState ) ?
			getMainRegistrationId() :
			0;
		return {
			checkin: hasCheckInState( checkinState ) &&
				DTT_ID &&
				mainRegistrationId ?
				getLatestCheckin( mainRegistrationId, DTT_ID ) :
				null,
			mainRegistrationId,
		};
	} ),
	withDispatch( ( dispatch ) => {
		return {
			createError: dispatch( 'core/notices' ).createErrorNotice,
			createSuccess: dispatch( 'core/notices' ).createSuccessNotice,
			resetStoreState: () => {
				const {
					resetStateForModel,
					resetModelSpecificForSelector,
				} = dispatch( 'eventespresso/core' );
				dispatch( 'eea-barcode-scanner/core' ).resetAllState();
				resetStateForModel( 'registration' );
				resetStateForModel( 'attendee' );
				resetStateForModel( 'checkin' );
				resetModelSpecificForSelector( 'getLatestCheckin' );
			},
		};
	} ),
	withCheckinState,
] )( ScannerView );
