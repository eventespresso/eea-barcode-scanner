/**
 * External Imports
 */
import { isModelEntityOfModel } from '@eventespresso/validators';
import isShallowEqual from '@wordpress/is-shallow-equal';
import { withSelect } from '@wordpress/data';
import { Spinner } from '@wordpress/components';
import { statusModel } from '@eventespresso/model';

/**
 * Internal Imports
 */
import TransactionOwing from './transaction-owing';
import RegistrationStatus from './registration-status';
import { CheckInAction, withLatestCheckin } from './checkin';
import RegistrationLinks from './registration-links';

const isRegistration = ( registration ) =>
	isModelEntityOfModel( registration, 'registration' );

export function RegistrationActionsView( {
	registration,
	DTT_ID,
	transaction = null,
} ) {
	const getTransactionOwing = () => {
		if ( ! isRegistration( registration ) && transaction === null ) {
			return null;
		}
		if ( isRegistration( registration ) && transaction === null ) {
			return <Spinner />;
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
		return withLatestCheckin(
			<CheckInAction
				registration={ registration }
				datetimeId={ DTT_ID }
			/>
		);
	};
	return (
		<div className={ 'eea-bs-registration-actions-container' }>
			{ getTransactionOwing() }
			{ getRegistrationStatus() }
			{ getCheckInAction }
			<RegistrationLinks registration={ registration } />
		</div>
	);
}

let prevTransactions;

export default withSelect( ( select, ownProps ) => {
	const {
		registration,
		transaction: prevTransaction,
	} = ownProps;
	const isReg = isRegistration( registration );
	const { getRelatedEntities } = select( 'eventespresso/core' );
	const transactions = isReg ?
		getRelatedEntities( registration, 'transaction' ) :
		prevTransactions;
	const transaction = transactions &&
		transactions.length > 0 &&
		! isShallowEqual( transactions, prevTransaction ) ?
		transactions.slice( 0, 1 ) :
		prevTransaction;
	prevTransactions = transactions;
	return {
		...ownProps,
		registration,
		transaction,
	};
} )( RegistrationActionsView );
