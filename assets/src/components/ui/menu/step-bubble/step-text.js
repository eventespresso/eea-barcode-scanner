/**
 * External imports
 */
import { Component } from '@wordpress/element';
import { pure } from '@wordpress/compose';


class StepText extends Component {
	render() {
		const  { content } = this.props;
		return content &&
			<span className="ee-step-bubble-step-text">
			{ content }
		</span>;
	}
}

export default pure( StepText );
