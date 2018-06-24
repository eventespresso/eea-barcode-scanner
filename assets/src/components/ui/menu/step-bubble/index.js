/**
 * Internal imports
 */
import './style.css';
import StepBubble from './step-bubble';

/**
 * External imports
 */
import { isArray } from 'lodash';

const StepBubbleMenu = ( {
	bubbleClick,
	bubbleData = [],
	clickable = [],
	activeBubble = ''
} ) => {
	return (
		<div className="ee-step-bubble-menu-container">
			{
				bubbleData.map( ( bubble ) => {
					let slug = bubble.slug || bubble.label;
					let canClick = clickable.indexOf( bubble.slug ) > -1;
					return (
						<StepBubble
							key={ bubble.label }
							label={ bubble.label }
							slug={ slug }
							stepValue={ bubble.value }
							isActive={ activeBubble === slug }
							canClick={ canClick }
							bubbleClick={ bubbleClick }
						/>
					);
				} )
			}
		</div>
	);
};

export default StepBubbleMenu;
