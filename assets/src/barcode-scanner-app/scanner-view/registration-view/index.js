/**
 * External imports
 */
import { isModelEntityOfModel } from '@eventespresso/validators';
import isShallowEqual from '@wordpress/is-shallow-equal';
import { withSelect } from '@wordpress/data';
import { Spinner } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

/**
 * Internal import
 */
import RegistrationDetailsView from './registration-details-view';
import RegistrationGroupView from './registration-group-view';

export function RegistrationView( {
	registration = null,
	attendee = null,
	DTT_ID = 0,
	registrationLoading = true,
	attendeeLoading = true,
} ) {
	const scannerResultsContent = registrationLoading && attendeeLoading ?
		<Spinner /> :
		(
			<Fragment>
				<RegistrationDetailsView
					attendee={ attendee }
					registration={ registration }
					DTT_ID={ DTT_ID }
				/>
				<RegistrationGroupView
					registration={ registration }
					datetimeId={ DTT_ID }
				/>
			</Fragment>
		);
	return (
		<div className={ 'eea-barcode-scanning-results' }>
			{ scannerResultsContent }
		</div>
	);
}

/**
 * Used to avoid unnecessary slice operations in the `withSelect`
 *
 * @type {Array}
 */
let previousRegistrations = [];
let previousAttendees = [];

export default withSelect( ( select, ownProps ) => {
	let attendee = null;
	let attendees = [];
	const {
		registrationCode,
		registration: prevRegistration,
		attendee: prevAttendee,
	} = ownProps;
	const registrations = select( 'eventespresso/list' ).getEntities(
		'registration',
		'where[REG_code]=' + registrationCode
	);
	const registration = registrations &&
	registrations.length > 0 &&
		! isShallowEqual( registrations, previousRegistrations ) ?
		registrations.slice( 0, 1 ) :
		prevRegistration;
	previousRegistrations = registrations;
	if ( isModelEntityOfModel( registration, 'registration' ) ) {
		attendees = select( 'eventespresso/core' ).getRelatedEntities(
			registration,
			'attendee'
		);
		attendee = attendees &&
			attendees.length > 0 &&
			! isShallowEqual( attendees, previousAttendees ) ?
			attendees.slice( 0, 1 ) :
			prevAttendee;
		previousAttendees = attendees;
	}
	return {
		registration,
		registrationLoading: select( 'eventespresso/lists' ).isRequestingEntities(
			'registration',
			'where[REG_code]=' + registrationCode
		),
		attendee,
		attendeeLoading: select( 'core/data' ).isResolving(
			'eventespresso/core',
			'getRelatedEntities',
			registration,
			'attendee'
		),
	};
} )( RegistrationView );
