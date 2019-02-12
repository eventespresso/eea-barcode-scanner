/**
 * External imports
 */
import { Component } from 'react';
import { Button } from '@wordpress/components';
import $ from 'jquery';
import { __ } from '@eventespresso/i18n';
import PropTypes from 'proptypes';
import { values } from 'lodash';

/**
 * Internal Imports
 */
import ScanTypeSelector, { scanTypes } from './scan-type-selector';
import ScanInput from './scan-input';

const SCANNER_OPTIONS = {
	// Callback after receive a char (original keypress event in parameter)
	timeBeforeScanTest: 100,
	// Average time (ms) between 2 chars. Used to do difference between keyboard
	// typing and scanning
	avgTimeByChar: 30,
	// Minimum length for a scanning
	minLength: 6,
	// Chars to remove and means end of scanning
	endChar: [ 9, 13 ],
	// Stop immediate propagation on keypress event
	stopPropagation: true,
	// Prevent default action on keypress event
	preventDefault: false,
};

const SCANNER_EVENTS = {
	SCANNER_DETECTION_COMPLETE: 'scannerDetectionComplete',
	SCANNER_DETECTION_ERROR: 'scannerDetectionError',
	SCANNER_DETECTION_RECEIVE: 'scannerDetectionReceive',
};

export default class ScanInputView extends Component {
	static propTypes = {
		onScannerComplete: PropTypes.func,
		onScannerError: PropTypes.func,
		onScannerReceive: PropTypes.func,
		scanTypeSelection: PropTypes.oneOf( values( scanTypes ) ),
		onScanTypeSelect: PropTypes.func,
		registrationCode: PropTypes.string,
		onManualInput: PropTypes.func,
	};

	submitInput = () => {
		this.props.onManualInput( this.$el.val() );
	};

	componentDidMount() {
		this.$el = $( this.el );
		this.$el.scannerDetection( SCANNER_OPTIONS );
		this.$el.on(
			SCANNER_EVENTS.SCANNER_DETECTION_COMPLETE,
			this.props.onScannerComplete,
		).on(
			SCANNER_EVENTS.SCANNER_DETECTION_ERROR,
			this.props.onScannerError,
		).on(
			SCANNER_EVENTS.SCANNER_DETECTION_RECEIVE,
			this.props.onScannerReceive,
		);
	}

	componentWillUnmount() {
		this.$el.off(
			SCANNER_EVENTS.SCANNER_DETECTION_COMPLETE,
			this.props.onScannerComplete,
		).off(
			SCANNER_EVENTS.SCANNER_DETECTION_ERROR,
			this.props.onScannerError,
		).off(
			SCANNER_EVENTS.SCANNER_DETECTION_RECEIVE,
			this.props.onScannerReceive,
		);
	}

	render() {
		return (
			<div className={ 'eea-bs-scan-input-view' }>
				<ScanTypeSelector
					value={ this.props.scanTypeSelection }
					onChange={ this.props.onScanTypeSelect }
				/>
				<ScanInput
					ref={ el => this.el = el }
					value={ this.props.registrationCode }
				/>
				<Button isPrimary={ true } onClick={ this.submitInput }>
					{ __( 'Go', 'event_espresso' ) }
				</Button>
			</div>
		);
	}
}