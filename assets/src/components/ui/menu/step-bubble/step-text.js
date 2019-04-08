/**
 * External imports
 */
import PropTypes from 'prop-types';
import { pure } from '@wordpress/compose';


const StepText = ( { content } ) => {
	return content &&
		<span className="ee-step-bubble-step-text">
		{ content }
	</span>;
};

StepText.propTypes = { content: PropTypes.string.isRequired };

export default pure( StepText );
