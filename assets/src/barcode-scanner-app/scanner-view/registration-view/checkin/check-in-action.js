/**
 * External Imports
 */
import { Component } from '@wordpress/element';

/**
 * Internal Imports
 */
import { TextBubble } from '../../../../components/ui/enhanced-text';
import { getCheckInStatusText } from './get-check-in-status-configuration';
import { CheckInButton } from './check-in-button';

export default class CheckInAction extends Component {
	render() {
		const { checkIn, onClick } = this.props;
		const { checkInStatusText } = getCheckInStatusText( checkIn );
		return (
			<div>
				<TextBubble>
					{ checkInStatusText }
				</TextBubble>
				<CheckInButton
					checkIn={ checkIn }
					onClick={ onClick }
				/>
			</div>
		);
	}
}
