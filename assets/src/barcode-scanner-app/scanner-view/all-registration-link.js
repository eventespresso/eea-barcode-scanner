/**
 * External imports
 */
import { Component } from '@wordpress/element';
import { ExternalLink } from '@wordpress/components';
import { routes } from '@eventespresso/eejs';
import { stringify } from 'querystringify';
import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';

const { getAdminUrl, ADMIN_ROUTES, ADMIN_ROUTE_ACTIONS } = routes;

export default class AllRegistrationLink extends Component {
	PropTypes = {
		EVT_ID: PropTypes.number.isRequired,
		DTT_ID: PropTypes.number.isRequired,
	};

	getLink() {
		return getAdminUrl(
			ADMIN_ROUTES.REGISTRATIONS,
			ADMIN_ROUTE_ACTIONS.REGISTRATIONS.EVENT_CHECKIN,
		) +
		stringify( {
			event_id: this.props.EVT_ID,
			DTT_ID: this.props.DTT_ID,
		}, '&' );
	}

	render() {
		return (
			<div className={ 'eea-bs-ed-checkin-link-container' }>
				<ExternalLink
					href={ this.getLink() }
				>
					{ __( 'View all Registrations', 'event_espresso' ) }
				</ExternalLink>
			</div>
		);
	}
}
