/**
 * External imports
 */
import { isModelEntityOfModel } from '@eventespresso/validators';
import { withSelect } from '@wordpress/data';
import { Spinner } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { compose, ifCondition } from '@wordpress/compose';

/**
 * Internal import
 */
import RegistrationDetailsView from './registration-details-view';
import RegistrationGroupView from './registration-group-view';

export function RegistrationView( {
	registration = null,
	attendee = null,
	DTT_ID = 0,
	finishedLoadingRegistrations = false,
	finishedLoadingAttendee = false,
} ) {
	const finishedLoading = () => finishedLoadingRegistrations &&
		finishedLoadingAttendee;
	let scannerResultsContent = ! finishedLoading() ?
		<Spinner /> :
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
		;
	// @todo surface error if unable to retrieve registration for the given
	// registration code?
	scannerResultsContent = finishedLoading() &&
		registration === null &&
		attendee === null ?
		null :
		scannerResultsContent;
	return (
		<div className={ 'eea-barcode-scanning-results' }>
			{ scannerResultsContent }
		</div>
	);
}

export default compose( [
	withSelect( ( select, ownProps ) => {
		const { registrationCode } = ownProps;
		const { getEntities } = select( 'eventespresso/lists' );
		const { getRelatedEntities } = select( 'eventespresso/core' );
		const { hasFinishedResolution } = select( 'core/data' );

		const finishedLoadingRegistrations = hasFinishedResolution(
			'eventespresso/lists',
			'getEntities',
			[ 'registration', 'where[REG_code]=' + registrationCode ]
		);

		const newRegistrations = getEntities(
			'registration',
			'where[REG_code]=' + registrationCode
		);
		const newRegistration = finishedLoadingRegistrations &&
		newRegistrations &&
		newRegistrations.length > 0 ?
			newRegistrations.slice( 0, 1 ).pop() :
			null;

		// early abort of finished loading attendee if can't obtain a valid
		// registration.
		let finishedLoadingAttendee = finishedLoadingRegistrations &&
			! isModelEntityOfModel( newRegistration, 'registration' );

		if (
			! finishedLoadingRegistrations ||
			( finishedLoadingAttendee && finishedLoadingRegistrations )
		) {
			return {
				registration: newRegistration,
				attendee: null,
				finishedLoadingRegistrations,
				finishedLoadingAttendee,
			};
		}

		finishedLoadingAttendee = hasFinishedResolution(
			'eventespresso/core',
			'getRelatedEntities',
			[ newRegistration, 'attendee', 'user_avatar' ]
		);
		const newAttendees = getRelatedEntities(
			newRegistration,
			'attendee',
			'user_avatar'
		);
		const newAttendee = finishedLoadingAttendee &&
			newAttendees &&
			newAttendees.length > 0 ?
			newAttendees.slice( 0, 1 ).pop() :
			null;

		return {
			registration: newRegistration,
			attendee: newAttendee,
			finishedLoadingAttendee,
			finishedLoadingRegistrations,
		};
	} ),
	ifCondition( ( { registrationCode } ) => registrationCode ),
] )( RegistrationView );
