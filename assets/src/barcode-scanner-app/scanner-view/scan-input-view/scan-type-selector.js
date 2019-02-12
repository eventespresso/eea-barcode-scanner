/**
 * External imports
 */
import { Component, Fragment } from 'react';
import Select from 'react-select';
import { __ } from '@eventespresso/i18n';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { values } from 'lodash';

export const scanTypes = {
	LOOKUP: 'lookup_attendee',
	TOGGLE: 'toggle_attendee',
	TOGGLE_NO_CHECKOUT: 'toggle_attendee_no_checkout',
	SEARCH: 'search_by_keyword',
};

export const scanTypeOptions = [
	{
		value: scanTypes.LOOKUP,
		label: __( 'Lookup Attendee', 'event_espresso' ),
	},
	{
		value: scanTypes.TOGGLE,
		label: __( 'Continuous Scanning', 'event_espresso' ),
	},
	{
		value: scanTypes.TOGGLE_NO_CHECKOUT,
		label: __( 'Continuous Check-in Only', 'event_espresso' ),
	},
	{
		value: scanTypes.SEARCH,
		label: __( 'Search by Keyword', 'event_espresso' ),
	},
];

export default class ScanTypeSelector extends Component {
	defaultProps = {
		value: scanTypeOptions[ 0 ],
		onChange: () => false,
	};

	propTypes = {
		value: PropTypes.shape( {
			value: PropTypes.oneOf( values( scanTypes ) ),
			label: PropTypes.string,
		} ),
		onChange: PropTypes.func,
	};

	state = {
		options: scanTypeOptions,
		value: scanTypeOptions[ 0 ],
		className: classNames(
			'basic-single',
			'eea-banner-scanner-action-select',
		),
		isClearable: false,
		isSearchable: false,
		name: 'scanner_form_default_action',
		onChange: () => false,
	};

	setValue = () => {
		if ( this.props.value.value !== this.state.value.value ) {
			this.setState( { value: this.props.value } );
		}
	};

	componentDidMount() {
		this.setValue();
		this.setState( { onChange: this.props.onChange } );
	}

	componentDidUpdate() {
		this.setValue();
	}

	render() {
		return (
			<Fragment>
				<Select { ...this.state } />
			</Fragment>
		);
	}
}
