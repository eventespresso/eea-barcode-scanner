/**
 * External imports
 */
import { Component } from 'react';
import PropTypes from 'prop-types';

export class ContactDetails extends Component {
	static propTypes = {
		fullName: PropTypes.string,
		email: PropTypes.email,
	};
	render() {
		return (
			<div className={ 'eea-bs-contact-details-container' }>
				<h3 className={ 'eea-bs-attendee-name' }>
					{ this.props.fullName }
				</h3>
				<section className={ 'eea-bs-contact-email-container' }>
					<span className={ 'eea-bs-contact-email' }>
						{ this.props.email }
					</span>
				</section>
			</div>
		);
	}
}
