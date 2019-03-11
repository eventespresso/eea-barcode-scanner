/**
 * External imports
 */
import { Component } from '@wordpress/element';
import { withSelect } from '@wordpress/data';
import AccessibleReactTable from 'accessible-react-table';
import { __ } from '@wordpress/i18n';

/**
 * Internal imports
 */
import {
	withLatestCheckin,
	CheckInAction,
	CheckInTimestamp,
	CheckInStatusIcon,
} from '../checkin';

export class RegistrationGroupTable extends Component {
	fName = ( registrationEntity ) => registrationEntity.attendee.fname;
	lName = ( registrationEntity ) => registrationEntity.attendee.lname;
	lastUpdate = ( registrationEntity ) => withLatestCheckin(
		<CheckInTimestamp
			registration={ registrationEntity }
			datetimeId={ this.props.datetimeId }
		/>
	);
	checkInStatus = ( registrationEntity ) => withLatestCheckin(
		<CheckInStatusIcon
			registration={ registrationEntity }
			datetimeId={ this.props.datetimeId }
		/>
	);
	checkInAction = ( registrationEntity ) => withLatestCheckin(
		<CheckInAction
			registration={ registrationEntity }
			datetimeId={ this.props.datetimeId }
		/>
	);

	render() {
		const columns = [
			{
				id: 'firstName',
				Header: __( 'First Name', 'event_espresso' ),
				accessor: this.fName,
			},
			{
				id: 'lastName',
				Header: __( 'Last Name', 'event_espresso' ),
				accessor: this.lName,
			},
			{
				id: 'checkInTimestamp',
				Header: __( 'Last update', 'event_espresso' ),
				accessor: this.lastUpdate,
			},
			{
				id: 'checkInStatus',
				Header: __( 'Status', 'event_espresso' ),
				accessor: this.checkInStatus,
			},
			{
				id: 'checkInAction',
				Header: '',
				accessor: this.checkInAction,
			},
		];
		return <AccessibleReactTable data={ this.data } columns={ columns } />;
	}
}

let previousAttendees = [];

export default withSelect( ( select, ownProps ) => {
	let attendees;
	const { registration } = ownProps;

	let { finishedLoading = false, data = [] } = ownProps;

	const {
		getEntities,
		getEntityById,
		getRelatedEntitiesForIds,
	} = select( 'eventespresso/core' );
	const { hasFinishedResolution } = select( 'core/data' );
	const groupRegistrations = getEntities( 'registration' ).filter(
		( registrationEntity ) => registrationEntity.id !== registration.id
	);
	const registrationIds = groupRegistrations.map(
		( registrationEntity ) => registrationEntity.id
	);

	if ( groupRegistrations ) {
		attendees = getRelatedEntitiesForIds(
			'registration',
			registrationIds,
			'attendees',
		);
		finishedLoading = ! hasFinishedResolution(
			'eventespresso/core',
			'getRelatedEntitiesForIds',
			'registration',
			registrationIds,
			'attendees'
		);

		if ( finishedLoading && attendees !== previousAttendees ) {
			data = groupRegistrations.map(
				( registrationEntity ) => {
					registrationEntity.attendee = getEntityById(
						'attendee',
						registrationEntity.attId
					);
					return registrationEntity;
				}
			);
		}
		previousAttendees = attendees;
	}

	return {
		...ownProps,
		data,
		finishedLoading,
	};
} );
