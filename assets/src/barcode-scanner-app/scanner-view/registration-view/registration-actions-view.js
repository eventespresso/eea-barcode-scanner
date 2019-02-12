/**
 * External Imports
 */
import { Component } from 'react';
import PropTypes from 'prop-types';
import { Money } from '@eventespresso/value-objects';

/**
 * Internal Imports
 */
import TransactionOwing from './transaction-owing';
import RegistrationStatus from './registration-status';

export default class RegistrationActionsView extends Component {
	static propTypes = {
		transactionStatus: PropTypes.string.isRequired,
		amountOwing: PropTypes.instanceOf( Money ).isRequired,
	};
	render() {
		const transactionProps = {
			status: this.props.transactionStatus,
			amountOwing: this.props.amountOwing,
		};
		const registrationProps = {
			status: this.props.registrationStatus,
			statusLabel: this.props.registrationStatusLabel,
		};
		return (
			<div className={ 'eea-bs-registration-actions-container' }>
				<TransactionOwing { ...transactionProps } />
				<RegistrationStatus { ...registrationProps } />
				<RegistrationAction />
				<RegistrationLinks />
			</div>
		)
	}
}