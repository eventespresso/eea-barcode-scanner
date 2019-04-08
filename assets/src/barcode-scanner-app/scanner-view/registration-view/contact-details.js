/**
 * External imports
 */
import PropTypes from 'prop-types';

const ContactDetails = ( { fullName, email } ) => {
	return (
		<div className={ 'eea-bs-contact-details-container' }>
			<h3 className={ 'eea-bs-attendee-name' }>
				{ fullName }
			</h3>
			<section className={ 'eea-bs-contact-email-container' }>
				<span className={ 'eea-bs-contact-email' }>
					{ email }
				</span>
			</section>
		</div>
	);
};

ContactDetails.propTypes = {
	fullName: PropTypes.string.isRequired,
	email: PropTypes.string.isRequired,
};

export default ContactDetails;
