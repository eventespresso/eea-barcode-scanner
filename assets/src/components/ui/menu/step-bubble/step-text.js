/**
 * External imports
 */
import { PureComponent } from 'react';


class StepText extends PureComponent {
	render() {
		const  { content } = this.props;
		return content &&
			<span className="ee-step-bubble-step-text">
			{ content }
		</span>;
	}
}

export default StepText;
