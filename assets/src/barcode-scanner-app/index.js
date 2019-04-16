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
		if ( slug !== this.state.currentStep ) {
			this.setState( {
				currentStep: slug,
				bubbleData: this.setActiveStep( slug ),
			} );
		}
	};

	/**
	 * Using a dedicated callback for the selector onChange
	 * events so that all of the logic is in one place
	 *
	 * @function
	 * @param {Object} selected
	 */
	onEventChange = ( { value = 0, label = '' } ) => {
		// changing event and not resetting? (only change state if needed)
		if ( value > 0 && value !== this.state.eventId ) {
			const bubbleData = this.setActiveStep( slugs.MENU_CHOOSE_DATETIME );
			// valid event id means advance to datetime step
			bubbleData[ slugs.MENU_CHOOSE_DATETIME ].clickable = true;
			bubbleData[ slugs.MENU_CHOOSE_EVENT ].clickable = true;
			// resetting this back to false because it may have been set true at
			// some point in the life of this component.
			bubbleData[ slugs.MENU_SCAN ].clickable = false;
			this.setState( {
				eventId: value,
				eventTitle: label,
				datetimeId: 0,
				dateTimeTitle: '',
				currentStep: slugs.MENU_CHOOSE_DATETIME,
				bubbleData: bubbleData,
			} );
		}
	};

	/**
	 * @function
	 * @param {Object} selected
	 */
	onDatetimeChange = ( { value = 0, label = '' } ) => {
		// changing datetime and not resetting? (only change state if needed)
		if ( value > 0 && value !== this.state.datetimeId ) {
			const bubbleData = this.setActiveStep( slugs.MENU_SCAN );
			bubbleData[ slugs.MENU_SCAN ].clickable = true;
			this.setState( {
				datetimeId: value,
				dateTimeTitle: label,
				currentStep: slugs.MENU_SCAN,
				bubbleData: bubbleData,
			} );
		}
	};

	/**
	 * returns a copy of the bubbleData object in state
	 *
	 * @function
	 * @return {Object} bubbleData
	 */
	getBubbleData = () => {
		return { ...this.state.bubbleData };
	};

	/**
	 * traverse the tree and ensure that the configuration for the
	 * bubbleData that matches the current step is the only one active.
	 *
	 * @function
	 * @param {string} currentStep
	 * @return {Object} bubbleData
	 */
	setActiveStep = ( currentStep ) => {
		const bubbleData = this.getBubbleData();
		for ( const slug in bubbleData ) {
			if ( bubbleData.hasOwnProperty( slug ) ) {
				bubbleData[ slug ].active = slug === currentStep;
			}
		}
		return bubbleData;
	};

	/**
	 * @function
	 * @param {string} currentStep
	 * @return {Object|null} rendered ScannerView
	 */
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
