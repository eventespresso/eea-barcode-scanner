/**
 * Internal imports
 */
import StepBubbleMenu from '../components/ui/menu/step-bubble';
import * as slugs from './menu-slugs';
import Selectors from './selectors';

/**
 * External imports
 */
import ReactDOM from 'react-dom';
import { __ } from '@eventespresso/i18n';
import { Component } from 'react';
import { values } from 'lodash';

class BarcodeApp extends Component {
	onBubbleClick = ( bubbleSlug ) => {
		this.setState( { currentStep: bubbleSlug } );
	};

	onDataUpdate = ( stepSlug, selectedValue ) => {
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

	render() {
		return (
			<div className="eea-barcode-scanning-container">
				<StepBubbleMenu
					bubbleClick={ this.onBubbleClick }
					bubbleData={ this.state.bubbleData }
					clickable={ this.state.clickable }
					activeBubble={ this.state.currentStep }
				/>
				<Selectors { ...this.state } />
				{/*<ScannerView />*/}
			</div>
		);
	}
}

ReactDOM.render(
	<BarcodeApp />,
	document.getElementById( 'root' )
);
