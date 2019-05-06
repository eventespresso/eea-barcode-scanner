/**
 * External imports
 */
import { Component } from '@wordpress/element';
import { withSelect } from '@wordpress/data';
import AccessibleReactTable from 'accessible-react-table';
import { __ } from '@wordpress/i18n';
import { isModelEntityOfModel } from '@eventespresso/validators';
import 'react-table/react-table.css';
import PropTypes from 'prop-types';
import { Spinner } from '@wordpress/components';
import { compose, ifCondition } from '@wordpress/compose';
import { withLatestCheckin } from '@eventespresso/higher-order-components';

/**
 * Internal imports
 */
import {
	CheckInButton,
	CheckInTimestamp,
	CheckInStatusIcon,
} from '../checkin';

const EnhancedTimestamp = compose( [
	withLatestCheckin,
	ifCondition( ( { hasResolvedCheckin } ) => hasResolvedCheckin ),
] )( CheckInTimestamp );
const EnhancedStatusIcon = compose( [
	withLatestCheckin,
	ifCondition( ( { hasResolvedCheckin } ) => hasResolvedCheckin ),
] )( CheckInStatusIcon );
const EnhancedButton = compose( [
	withLatestCheckin,
	ifCondition( ( { hasResolvedCheckin } ) => hasResolvedCheckin ),
] )( CheckInButton );

export class RegistrationGroupTable extends Component {
	static propTypes = {
		data: PropTypes.array,
		finishedLoading: PropTypes.bool,
		datetimeId: PropTypes.number,
		perPage: PropTypes.number,
	};
	static defaultProps = {
		data: [],
		finishedLoading: false,
		datetimeId: 0,
		perPage: 20,
	};
	fName = ( entityRecord ) => entityRecord.attendee.fname;
	lName = ( entityRecord ) => entityRecord.attendee.lname;
	lastUpdate = ( entityRecord ) => <EnhancedTimestamp
		registration={ entityRecord.registration }
		datetimeId={ this.props.datetimeId }
	/>;
	checkInStatus = ( entityRecord ) => <EnhancedStatusIcon
		registration={ entityRecord.registration }
		datetimeId={ this.props.datetimeId }
	/>;
	checkInButton = ( entityRecord ) => <EnhancedButton
		registration={ entityRecord.registration }
		datetimeId={ this.props.datetimeId }
	/>;
	showPagination = () => this.props.data.length > this.props.perPage;
	minRows = () => this.showPagination() ?
		this.props.perPage :
		this.props.data.length;

	render() {
		// @todo need to gracefully handle when finished loading and there's
		// an error or no data.
		if ( ! this.props.finishedLoading || this.props.data.length === 0 ) {
			return <Spinner />;
		}
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
				id: 'checkInButton',
				Header: '',
				accessor: this.checkInButton,
			},
		];
		return <AccessibleReactTable
			data={ this.props.data }
			columns={ columns }
			perPage={ this.props.perPage }
			showPagination={ this.showPagination() }
			minRows={ this.minRows() }
		/>;
	}
}

export default withSelect( ( select, ownProps ) => {
	let attendees;
	const { registration } = ownProps;
	let finishedAttendeeLoading;

	if (
		! isModelEntityOfModel( registration, 'registration' )
	) {
		return {};
	}

	const {
		getEntitiesForModel,
		getEntityById,
		getRelatedEntitiesForIds,
	} = select( 'eventespresso/core' );
	const { hasFinishedResolution } = select( 'core/data' );

	const hasResolvedGroupRegistrations = hasFinishedResolution(
		'eventespresso/lists',
		'getEntities',
		[ 'registration', 'where[TXN_ID]=' + registration.txnId ]
	);

	if ( ! hasResolvedGroupRegistrations ) {
		return {};
	}

	const groupRegistrations = getEntitiesForModel( 'registration' ).filter(
		( registrationEntity ) => registrationEntity.id !== registration.id
	);
	const registrationIds = groupRegistrations.map(
		( registrationEntity ) => registrationEntity.id
	);

	let finishedLoading = false,
		data = [];

	if ( groupRegistrations ) {
		attendees = getRelatedEntitiesForIds(
			'registration',
			registrationIds,
			'attendees',
			'user_avatar'
		);
		finishedAttendeeLoading = hasFinishedResolution(
			'eventespresso/core',
			'getRelatedEntitiesForIds',
			[ 'registration', registrationIds, 'attendees', 'user_avatar' ]
		);

		if ( finishedAttendeeLoading && attendees && attendees.length > 0 ) {
			data = groupRegistrations.map(
				( registrationEntity ) => {
					return {
						registration: registrationEntity,
						attendee: getEntityById(
							'attendee',
							registrationEntity.attId
						),
					};
				}
			);
			finishedLoading = true;
		}
	}
	return { data, finishedLoading };
} )( RegistrationGroupTable );
