/**
 * Internal imports
 */
import StepText from './step-text';

/**
 * External imports
 */
import classNames from 'classnames';
import { Component } from '@wordpress/element';
import { pure } from '@wordpress/compose'

class StepBubble extends Component {
	render() {
		const {
			label,
			slug,
			isActive = false,
			stepValue = 1,
			canClick = true,
			bubbleClick = () => true
		} = this.props;
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
	}
}

export default pure( StepBubble );
