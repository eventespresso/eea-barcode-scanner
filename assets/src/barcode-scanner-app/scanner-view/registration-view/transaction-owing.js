/**
 * External Imports
 */
import { Component } from 'react';
import { __ } from '@eventespresso/i18n';
import { Money } from '@eventespresso/value-objects';
import PropTypes from 'prop-types';

/**
 * Internal Imports
 */
import { StatusSection } from '../../../components/ui/indicators';

export default class TransactionOwing extends Component {
	static propTypes = {
		status: PropTypes.string.isRequired,
		amountOwing: PropTypes.instanceOf( Money ).isRequired,
	};

	render() {
		const { status, amountOwing } = this.props;
		const props = {
			className: 'transaction-' + status,
			statusLabel: __( 'Owing: ', 'event_espresso' ),
			statusValue: amountOwing.toString(),
			statusCode: status,
		};

		return <StatusSection { ...props } />;
	}
}
