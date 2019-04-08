/**
 * External Imports
 */
import { isModelEntityOfModel } from '@eventespresso/validators';
import { withSelect } from '@wordpress/data';
import { Spinner } from '@wordpress/components';
import { statusModel } from '@eventespresso/model';
import PropTypes from 'prop-types';

/**
 * Internal Imports
 */
import TransactionOwing from './transaction-owing';
import RegistrationStatus from './registration-status';
import { CheckInAction, withLatestCheckin } from './checkin';
import RegistrationLinks from './registration-links';

const isRegistration = ( registration ) =>
	isModelEntityOfModel( registration, 'registration' );

const EnhancedCheckInAction = withLatestCheckin( CheckInAction );

export function RegistrationActionsView( {
	registration,
	DTT_ID,
	transaction,
} ) {
	const getTransactionOwing = () => {
		if ( transaction === null ) {
			return null;
		}
		return <TransactionOwing
			status={ transaction.STS_ID }
			amountOwing={ transaction.total.subtract( transaction.paid ) }
		/>;
	};
	const getRegistrationStatus = () => {
		if ( ! isRegistration( registration ) ) {
			return null;
		}
		return <RegistrationStatus
			status={ registration.STS_ID }
			statusLabel={ statusModel.prettyStatus( registration.STS_ID ) }
		/>;
	};
	const getCheckInAction = () => {
		if ( ! isRegistration( registration ) ) {
			return <Spinner />;
		}
		return <EnhancedCheckInAction
			registration={ registration }
			datetimeId={ DTT_ID }
		/>;
	};
	return (
		<div className={ 'eea-bs-registration-actions-container' }>
			{ getTransactionOwing() }
			{ getRegistrationStatus() }
			{ getCheckInAction() }
			<RegistrationLinks registration={ registration } />
		</div>
	);
}

RegistrationActionsView.propTypes = {
	registration: PropTypes.object,
	DTT_ID: PropTypes.number,
	transaction: PropTypes.object,
};

RegistrationActionsView.defaultProps = {
	registration: null,
	DTT_ID: 0,
	transaction: null,
};

const WrappedComponent = withSelect(
	( select, { registration, transaction } ) => {
		const isReg = isRegistration( registration );
		const { getRelatedEntities } = select( 'eventespresso/core' );
		const transactions = isReg ?
			getRelatedEntities( registration, 'transaction' ) :
			[];
		const newTransaction = transactions &&
			transactions.length > 0 ?
			transactions.slice( 0, 1 ).pop() :
			transaction;
		return { transaction: newTransaction };
	} )( RegistrationActionsView );

WrappedComponent.propTypes = {
	registration: PropTypes.object,
	transaction: PropTypes.object,
};

WrappedComponent.defaultProps = {
	registration: null,
	transaction: null,
};

export default WrappedComponent;
