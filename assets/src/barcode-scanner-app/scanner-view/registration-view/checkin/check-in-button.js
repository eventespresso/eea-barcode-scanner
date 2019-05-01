/**
 * External imports.
 */
import { Button } from '@wordpress/components';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import {
	getCheckInActionText,
	getCheckinActionClassName,
} from './get-check-in-status-configuration';

const CheckInButton = ( { checkinEntity, onClick } ) => {
	const buttonText = getCheckInActionText( checkinEntity );
	const cssClass = classnames(
		getCheckinActionClassName( checkinEntity ),
		'ee-button',
		'ee-roundish'
	);
	return <Button onClick={ onClick } className={ cssClass }>
		{ buttonText }
	</Button>;
};

CheckInButton.propTypes = {
	checkinEntity: PropTypes.object,
	onClick: PropTypes.func,
};

CheckInButton.defaultProps = {
	checkinEntity: null,
	onClick: () => null,
};

export default CheckInButton;
