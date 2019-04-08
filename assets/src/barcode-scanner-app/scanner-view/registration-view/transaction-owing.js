/**
 * External Imports
 */
import { __ } from '@wordpress/i18n';
import { Money } from '@eventespresso/value-objects';
import PropTypes from 'prop-types';

/**
 * Internal Imports
 */
import { StatusSection } from '../../../components/ui/indicators';

const TransactionOwing = ( { status, amountOwing } ) => {
	const props = {
		className: 'transaction-' + status,
		statusLabel: __( 'Owing: ', 'event_espresso' ),
		statusValue: amountOwing.toString(),
		statusCode: status,
	};

	return <StatusSection { ...props } />;
};

TransactionOwing.propTypes = {
	status: PropTypes.string.isRequired,
	amountOwing: PropTypes.instanceOf( Money ).isRequired,
};

export default TransactionOwing;
