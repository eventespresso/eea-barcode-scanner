/**
 * External imports
 */
import { isModelEntityOfModel } from '@eventespresso/validators';
import { withSelect } from '@wordpress/data';
import { Spinner } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { compose, ifCondition } from '@wordpress/compose';
import PropTypes from 'prop-types';

/**
 * Internal import
 */
import RegistrationDetailsView from './registration-details-view';
import RegistrationGroupView from './registration-group-view';

export function RegistrationView( {
	registration,
	attendee,
	DTT_ID,
	finishedLoadingRegistration,
	finishedLoadingAttendee,
} ) {
	const finishedLoading = () => finishedLoadingRegistration &&
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

RegistrationView.propTypes = {
	registration: PropTypes.object,
	attendee: PropTypes.object,
	DTT_ID: PropTypes.number,
	finishedLoadingRegistration: PropTypes.bool,
	finishedLoadingAttendee: PropTypes.bool,
};

RegistrationView.defaultProps = {
	registration: null,
	attendee: null,
	DTT_ID: 0,
	finishedLoadingRegistration: false,
	finishedLoadingAttendee: false,
};

const WrappedComponent = compose( [
	withSelect( ( select, { registrationCode } ) => {
		const { getEntities } = select( 'eventespresso/lists' );
		const { getRelatedEntities } = select( 'eventespresso/core' );
		const { hasFinishedResolution } = select( 'core/data' );

		const finishedLoadingRegistration = hasFinishedResolution(
			'eventespresso/lists',
			'getEntities',
			[ 'registration', 'where[REG_code]=' + registrationCode ]
		);

		const newRegistrations = getEntities(
			'registration',
			'where[REG_code]=' + registrationCode
		);
		const newRegistration = finishedLoadingRegistration &&
		newRegistrations &&
		newRegistrations.length > 0 ?
			newRegistrations.slice( 0, 1 ).pop() :
			null;

		// early abort of finished loading attendee if can't obtain a valid
		// registration.
		let finishedLoadingAttendee = finishedLoadingRegistration &&
			! isModelEntityOfModel( newRegistration, 'registration' );

		if (
			! finishedLoadingRegistration ||
			( finishedLoadingAttendee && finishedLoadingRegistration )
		) {
			return {
				registration: newRegistration,
				attendee: null,
				finishedLoadingRegistration,
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
			finishedLoadingRegistration,
		};
	} ),
	ifCondition( ( { registrationCode } ) => registrationCode ),
] )( RegistrationView );

WrappedComponent.propTypes = { registrationCode: PropTypes.string };
WrappedComponent.defaultProps = { registrationCode: '' };

export default WrappedComponent;
