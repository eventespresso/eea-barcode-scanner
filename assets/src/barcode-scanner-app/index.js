/**
 * Internal imports
 */
import * as slugs from './menu-slugs';
import Selectors from './selectors';
import ScannerNotices from '../components/scanner-notices';
import ScannerView from './scanner-view';

/**
 * External imports
 */
import { render as domRender, Component, Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { StepBubbleMenu } from '@eventespresso/components';

/**
 * import and register data api
 */
import '../data';

class BarcodeApp extends Component {
	state = {
		bubbleData: {},
		currentStep: '',
		eventId: 0,
		eventTitle: '',
		datetimeId: 0,
		dateTimeTitle: '',
	};

	componentDidMount() {
		this.setState( {
			bubbleData: {
				// using slugs as keys = direct access
				// and a guarantee that slugs can be used as keys
				// simply verifying that slugs are strings does not!
				[ slugs.MENU_CHOOSE_EVENT ]: {
					label: __( 'Choose Event', 'event_espresso' ),
					value: 1,
					// first step is initially active and clickable
					active: true,
					clickable: true,
					action: this.onBubbleClick,
				},
				[ slugs.MENU_CHOOSE_DATETIME ]: {
					label: __( 'Choose Datetime', 'event_espresso' ),
					value: 2,
					// second step initially not active or clickable
					active: false,
					clickable: false,
					action: this.onBubbleClick,
				},
				[ slugs.MENU_SCAN ]: {
					label: __( 'Scan', 'event_espresso' ),
					value: 3,
					// last step initially not active or clickable
					active: false,
					clickable: false,
					// we can share the same class method for all steps,
					// but just showing that each bubble step CAN receive
					// its very own callback which is more versatile
					action: this.onBubbleClick,
				},
			},
			currentStep: slugs.MENU_CHOOSE_EVENT,
		} );
	}

	/**
	 * @function
	 * @param {string} slug
	 */
	onBubbleClick = ( slug ) => {
		this.setState( { currentStep: slug } );
	};

	/**
	 * Using a dedicated callback for the selector onChange
	 * events so that all of the logic is in one place
	 *
	 * @function
	 * @param {Object} selected
	 */
	onEventChange = ( { value = 0, label = '' } ) => {
		// changing event and not resetting?
		const currentStep = value > 0 && value !== this.state.eventId ?
			slugs.MENU_CHOOSE_DATETIME :
			slugs.MENU_CHOOSE_EVENT;
		const bubbleData = this.state.bubbleData;
		// valid event id means advance to datetime step
		bubbleData[ slugs.MENU_CHOOSE_DATETIME ].clickable = value > 0;
		// setting this back to false just in case
		bubbleData[ slugs.MENU_SCAN ].clickable = false;
		this.setState( {
			eventId: value,
			eventTitle: label,
			datetimeId: 0,
			dateTimeTitle: '',
			currentStep: currentStep,
			bubbleData: this.setActiveStep( currentStep, bubbleData ),
		} );
	};

	/**
	 * @function
	 * @param {Object} selected
	 */
	onDatetimeChange = ( { value = 0, label = '' } ) => {
		// changing datetime and not resetting?
		const currentStep = value > 0 && value !== this.state.datetimeId ?
			slugs.MENU_SCAN :
			slugs.MENU_CHOOSE_DATETIME;
		const bubbleData = this.state.bubbleData;
		// valid datetime id means advance to scan step
		bubbleData[ slugs.MENU_SCAN ].clickable = value > 0;
		this.setState( {
			datetimeId: value,
			dateTimeTitle: label,
			currentStep: currentStep,
			bubbleData: this.setActiveStep( currentStep, bubbleData ),
		} );
	};

	/**
	 * @function
	 * @param {string} currentStep
	 * @param {Object} bubbleData
	 * @return {Object} bubbleData
	 */
	setActiveStep = ( currentStep, bubbleData ) => {
		for ( const slug in bubbleData ) {
			if ( bubbleData.hasOwnProperty( slug ) ) {
				bubbleData[ slug ].active = currentStep === slug;
			}
		}
		return bubbleData;
	};

	getScannerView = ( currentStep ) => {
		return currentStep === slugs.MENU_SCAN ? (
			<ScannerView
				datetimeId={ this.state.datetimeId }
				eventId={ this.state.eventId }
			/>
		) : null;
	};

	render() {
		return (
			<Fragment>
				<ScannerNotices />
				<div className="eea-barcode-scanning-container">
					<StepBubbleMenu bubbleData={ this.state.bubbleData } />
					<Selectors
						currentStep={ this.state.currentStep }
						eventId={ this.state.eventId }
						datetimeId={ this.state.datetimeId }
						eventTitle={ this.state.eventTitle }
						dateTimeTitle={ this.state.dateTimeTitle }
						onEventChange={ this.onEventChange }
						onDatetimeChange={ this.onDatetimeChange }
					/>
					{ this.getScannerView( this.state.currentStep ) }
				</div>
			</Fragment>
		);
	}
}

domRender(
	<BarcodeApp />,
	document.getElementById( 'root' )
);
