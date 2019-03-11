/**
 * External imports
 */
import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';

/**
 * Internal imports
 */
import RegistrationGroupTable from './registration-group-table';
import {
	ToggleCheckinForAllRegistrationsButton,
} from '../checkin';

const RegistrationGroupView = ( {
	registration,
	datetimeId,
	isGroupVisible,
} ) => {
	return isGroupVisible ?
		( <div className="registration-group-view">
			<h3>
				{ __( 'Other People in this Group', 'event_espresso' ) }
			</h3>
			<RegistrationGroupTable
				registration={ registration }
				datetimeId={ datetimeId }
			/>;
			<ToggleCheckinForAllRegistrationsButton
				registration={ registration }
				datetimeId={ datetimeId }
			/>
		</div> ) :
		'';
};

export default withSelect( ( select, ownProps ) => {
	return {
		...ownProps,
		isGroupVisible: select( 'eea-barcode-scanner/core' ).isGroupVisible,
	};
} )( RegistrationGroupView );
