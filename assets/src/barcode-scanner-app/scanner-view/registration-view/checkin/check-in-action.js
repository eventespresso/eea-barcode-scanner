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
		const { checkinEntity, onClick, hasResolvedCheckin } = this.props;
		return hasResolvedCheckin ?
			<div>
				<TextBubble>
					{ getCheckInStatusText( checkinEntity ) }
				</TextBubble>
				<CheckInButton
					checkinEntity={ checkinEntity }
					onClick={ onClick }
				/>
			</div> :
			null;
	}
}
