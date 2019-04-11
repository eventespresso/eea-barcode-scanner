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
import { values } from 'lodash';
import { StepBubbleMenu } from '@eventespresso/components';

/**
 * import and register data api
 */
import '../data';

class BarcodeApp extends Component {
	onBubbleClick = ( bubbleSlug ) => {
		this.setState( { currentStep: bubbleSlug } );
	};

	onDataUpdate = ( stepSlug, selectedValue ) => {
		if ( selectedValue === null ) {
			if ( stepSlug === slugs.MENU_CHOOSE_EVENT ) {
				this.updateEventState();
				this.updateDatetimeState();
			}
			if ( stepSlug === slugs.MENU_CHOOSE_DATETIME ) {
				this.updateDatetimeState();
			}
			return;
		}
		if ( stepSlug === slugs.MENU_CHOOSE_EVENT &&
			selectedValue.value &&
			selectedValue.value !== this.state.selectedEventId
		) {
			this.updateEventState( selectedValue );
			this.updateDatetimeState();
			this.setState( { currentStep: slugs.MENU_CHOOSE_DATETIME } );
		}
		if ( stepSlug === slugs.MENU_CHOOSE_DATETIME &&
			selectedValue.value &&
			selectedValue.value !== this.state.selectedDatetimeId
		) {
			this.updateDatetimeState( selectedValue );
			this.setState( { currentStep: slugs.MENU_SCAN } );
		}
	};

	state = {
		bubbleData: [],
		currentStep: '',
		selectedEventId: 0,
		eventTitle: '',
		selectedDatetimeId: 0,
		dateTimeTitle: '',
		onDataUpdate: this.onDataUpdate,
	};

	componentDidMount() {
		this.setState( {
			bubbleData: [
				{
					label: __( 'Choose Event', 'event_espresso' ),
					value: 1,
					slug: slugs.MENU_CHOOSE_EVENT,
				},
				{
					label: __( 'Choose Datetime', 'event_espresso' ),
					value: 2,
					slug: slugs.MENU_CHOOSE_DATETIME,
				},
				{
					label: __( 'Scan', 'event_espresso' ),
					value: 3,
					slug: slugs.MENU_SCAN,
				},
			],
			currentStep: slugs.MENU_CHOOSE_EVENT,
			clickable: [ ...values( slugs ) ],
		} );
	}

	updateEventState( selectedValue = {} ) {
		this.setState( {
			selectedEventId: selectedValue.value || 0,
			eventTitle: selectedValue.label || '',
		} );
	}

	updateDatetimeState( selectedValue = {} ) {
		this.setState( {
			selectedDatetimeId: selectedValue.value || 0,
			dateTimeTitle: selectedValue.label || '',
		} );
	}

	getScannerView() {
		if ( this.state.currentStep === slugs.MENU_SCAN ) {
			return <ScannerView
				datetimeId={ this.state.selectedDatetimeId }
				eventId={ this.state.selectedEventId }
			/>;
		}
		return null;
	}

	render() {
		return (
			<Fragment>
				<ScannerNotices />
				<div className="eea-barcode-scanning-container">
					<StepBubbleMenu
						bubbleClick={ this.onBubbleClick }
						bubbleData={ this.state.bubbleData }
						clickable={ this.state.clickable }
						activeBubble={ this.state.currentStep }
					/>
					<Selectors { ...this.state } />
					{ this.getScannerView() }
				</div>
			</Fragment>
		);
	}
}

domRender(
	<BarcodeApp />,
	document.getElementById( 'root' )
);
