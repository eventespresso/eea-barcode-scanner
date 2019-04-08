/**
 * External imports
 */
import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';

/**
 * Internal Imports
 */
import { StatusSection } from '../../../components/ui/indicators';

const RegistrationStatus = ( {
	status,
	statusLabel: registrationStatusLabel,
} ) => {
	const props = {
		className: 'registration-' + status,
		statusLabel: __( 'Registration Status: ', 'event_espresso' ),
		statusValue: registrationStatusLabel,
		statusCode: status,
	};

	return <StatusSection { ...props } />;
};

RegistrationStatus.propTypes = {
	status: PropTypes.string.isRequired,
	statusLabel: PropTypes.string.isRequired,
};

export default RegistrationStatus;
