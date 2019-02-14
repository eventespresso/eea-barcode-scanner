/**
 * External imports
 */
import { Component } from '@wordpress/element';
import { __ } from '@eventespresso/i18n';
import PropTypes from 'prop-types';

/**
 * Internal Imports
 */
import { StatusSection } from '../../../components/ui/indicators';

export default class RegistrationStatus extends Component {
	static propTypes = {
		status: PropTypes.string.isRequired,
		statusLabel: PropTypes.string.isRequired,
	};

	render() {
		const {
			status,
			statusLabel: registrationStatusLabel,
		} = this.props;
		const props = {
			className: 'registration-' + status,
			statusLabel: __( 'Registration Status: ', 'event_espresso' ),
			statusValue: registrationStatusLabel,
			statusCode: status,
		};

		return <StatusSection { ...props } />;
	}
}
