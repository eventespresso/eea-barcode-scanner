/**
 * External imports
 */
import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';
import { Spinner } from '@wordpress/components';

/**
 * Internal imports
 */
import RegistrationGroupTable from './registration-group-table';
import { ToggleCheckinForAllRegistrationsButton } from '../checkin';

const RegistrationGroupView = ( {
	registration,
	datetimeId,
	isGroupVisible,
	finishedLoadingGroup = false,
} ) => {
	const getGroupView = () => {
		return finishedLoadingGroup ?
			<RegistrationGroupTable
				registration={ registration }
				datetimeId={ datetimeId }
			/> :
			<Spinner />;
	};
	return isGroupVisible ?
		<div className="registration-group-view">
			<h3>
				{ __( 'Other People in this Group', 'event_espresso' ) }
			</h3>
			<ToggleCheckinForAllRegistrationsButton
				registration={ registration }
				datetimeId={ datetimeId }
			/>
			{ getGroupView() }
		</div> :
		null;
};

export default withSelect( ( select, ownProps ) => {
	const { registration } = ownProps;
	const { isGroupVisible } = select( 'eea-barcode-scanner/core' );
	const { getEntities } = select( 'eventespresso/lists' );
	const { hasFinishedResolution } = select( 'core/data' );

	// trigger getting all group registrations into the state.
	getEntities(
		'registration',
		'where[TXN_ID]=' + registration.txnId
	);

	return {
		isGroupVisible: isGroupVisible( ownProps.registration.id ),
		finishedLoadingGroup: hasFinishedResolution(
			'eventespresso/lists',
			'getEntities',
			[ 'registration', 'where[TXN_ID]=' + ownProps.registration.txnId ]
		),
	};
} )( RegistrationGroupView );
