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
import { NOTICE_ID_SCAN_ERRROR, NOTICE_ID_SCAN_SUCCESS } from '../constants';
import {
	NOTICE_ID_TOGGLE_CHECKIN_ERROR,
} from './registration-view/checkin/constants';

// @todo add reset actions for eventespresso/lists store (which is needed because
// of the usage in the barcode scanner `toggleCheckInState` action!

export class ScannerView extends Component {
	state = {
		registrationCode: '',
		scanTypeSelection: scanTypes.LOOKUP,
		doReset: false,
	};

	onScannerComplete = ( inputEvent, data ) => {
		this.setRegistrationCode( data.string );
		this.triggerToggleCheckin( data.string );
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
		this.setScanTypeSelection( selectedValue.value );
		this.setRegistrationCode( '' );
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
		this.triggerToggleCheckin( registrationCode );
	};

	resetState = () => {
		this.props.resetCheckinState();
		this.props.resetStoreState();
	};

	triggerToggleCheckin( registrationCode ) {
		if (
			this.state.scanTypeSelection === scanTypes.LOOKUP ||
			this.state.scanTypeSelection === scanTypes.SEARCH
		) {
			return;
		}
		this.props.toggleCheckin(
			registrationCode,
			this.props.datetimeId,
			this.state.scanTypeSelection === scanTypes.TOGGLE_NO_CHECKOUT
		);
	}

	redirect( registrationCode ) {
		const parts = this.props.eventId && this.props.datetimeId ?
			'&event_id=' + this.props.eventId +
			'&DTT_ID=' + this.props.datetimeId +
			'&s=' + registrationCode :
			'&s=' + registrationCode;
		window.location.href = routes.getAdminUrl(
			routes.ADMIN_ROUTES.REGISTRATIONS,
			routes.ADMIN_ROUTE_ACTIONS.REGISTRATIONS.EVENT_CHECKIN
		) + parts;
	}

	setRegistrationCode( registrationCode ) {
		const change = { registrationCode };
		if ( this.state.registrationCode !== '' && registrationCode === '' ) {
			change.doReset = true;
		}
		this.setState( change );
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
				DTT_ID={ this.props.datetimeId }
				registrationCode={ this.state.registrationCode }
				//onUnsubscribe={ this.onUnsubscribe }
			/>;
		}
		if (
			this.props.checkinState === CHECKIN_STATES.IDLE ||
			this.props.checkinState === CHECKIN_STATES.LOADING
		) {
			return null;
		}
		return <CheckInResult checkin={ this.props.checkin } />;
	}

	componentDidUpdate() {
		if ( this.state.doReset ) {
			this.setState( { doReset: false } );
			this.resetState();
		}
	}

	render() {
		return (
			<div className={ 'eea-bs-scanner-view-container' }>
				<AllRegistrationLink
					DTT_ID={ this.props.datetimeId }
					EVT_ID={ this.props.eventId }
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
	withDispatch( ( dispatch ) => {
		return {
			createError: dispatch( 'core/notices' ).createErrorNotice,
			createSuccess: dispatch( 'core/notices' ).createSuccessNotice,
			resetStoreState: () => {
				const {
					resetStateForModel,
				} = dispatch( 'eventespresso/core' );
				const {
					resetAllState,
				} = dispatch( 'eea-barcode-scanner/core' );
				const { removeNotice } = dispatch( 'core/notices' );
				resetAllState( true );
				resetStateForModel( 'registration' );
				resetStateForModel( 'attendee' );
				resetStateForModel( 'transaction' );
				resetStateForModel( 'checkin' );
				removeNotice( NOTICE_ID_SCAN_SUCCESS );
				removeNotice( NOTICE_ID_SCAN_ERRROR );
				removeNotice( NOTICE_ID_TOGGLE_CHECKIN_ERROR );
			},
		};
	} ),
	withCheckinState,
	withSelect( ( select, ownProps ) => {
		const hasCheckInState = ( checkinState ) => {
			return checkinState !== CHECKIN_STATES.IDLE &&
				checkinState !== CHECKIN_STATES.ERROR &&
				checkinState !== CHECKIN_STATES.LOADING;
		};
		const { datetimeId, checkinState } = ownProps;
		const { getLatestCheckin } = select( 'eventespresso/core' );
		const { getMainRegistrationId } = select( 'eea-barcode-scanner/core' );
		const mainRegistrationId = hasCheckInState( checkinState ) ?
			getMainRegistrationId() :
			0;
		return {
			checkin: hasCheckInState( checkinState ) &&
				datetimeId &&
				mainRegistrationId ?
				getLatestCheckin( mainRegistrationId, datetimeId ) :
				null,
			mainRegistrationId,
		};
	} ),
] )( ScannerView );
