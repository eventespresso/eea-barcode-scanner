/**
 * Internal imports
 */
import StepText from './step-text';

/**
 * External imports
 */
import classNames from 'classnames';
import { pure } from '@wordpress/compose'
import PropTypes from 'prop-types';

const StepBubble = ( {
	label,
	slug,
	isActive,
	stepValue,
	canClick,
	bubbleClick,
} ) => {
	const cssClass = classNames(
		'ee-step-bubble-item',
		{ 'ee-step-bubble-active': isActive },
		{ 'ee-clickable': canClick },
	);
	const inner = canClick ?
		<div className="ee-step-bubble" onClick={ () => bubbleClick( slug ) }>
			<p>{ stepValue }</p>
		</div> :
		<div className="ee-step-bubble">
			<p>{ stepValue }</p>
		</div>;
	return (
		<div className={ cssClass }>
			{ inner }
			<StepText content={ label } />
		</div>
	);
};

StepBubble.propTypes = {
	label: PropTypes.string.isRequired,
	slug: PropTypes.string.isRequired,
	isActive: PropTypes.bool,
	stepValue: PropTypes.oneOfType( [
		PropTypes.number,
		PropTypes.string,
	] ),
	canClick: PropTypes.bool,
	bubbleClick: PropTypes.func,
};
StepBubble.defaultProps = {
	isActive: false,
	stepValue: 1,
	canClick: true,
	bubbleClick: () => null,
};

export default pure( StepBubble );
