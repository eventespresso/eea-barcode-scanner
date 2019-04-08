/**
 * External Imports
 */
import PropTypes from 'prop-types';

/**
 * Internal Imports
 */
import { TextBubble } from '../../../../components/ui/enhanced-text';
import { getCheckInStatusText } from './get-check-in-status-configuration';
import CheckInButton from './check-in-button';

const CheckInAction = ( { checkinEntity, onClick, hasResolvedCheckin } ) => {
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
};

CheckInAction.propTypes = {
	checkinEntity: PropTypes.object,
	onClick: PropTypes.func,
	hasResolvedCheckin: PropTypes.bool,
};

CheckInAction.defaultProps = {
	checkinEntity: null,
	onClick: () => null,
	hasResolvedCheckin: false,
};

export default CheckInAction;
