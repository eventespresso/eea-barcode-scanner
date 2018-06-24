/**
 * External imports
 */
import { Component } from 'react';
import { ExternalLink } from '@wordpress/components';

export default class AllRegistrationLink extends Component {
	getLink() {
		// return link to registration admin page generated from event_id and
		// datetimeId that should be available via props.
		return '';
	}

	render() {
		return (
			<div className={ 'eea-bs-ed-checkin-link-container' }>
				<ExternalLink { ...this.props } />
			</div>
		);
	}
};

/**
 * Todos:
 * - need to expose root path on eejs.data for link root
 * - might want to consider creating a library that returns paths to various
 *   EE routes that can be added to as needed.
 * - Pass needed props through here.  See also the props `ExternalLink` uses at
 *   https://github.com/WordPress/gutenberg/blob/master/components/external-link/index.js
 */
