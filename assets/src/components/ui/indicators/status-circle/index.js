/**
 * External Imports
 */
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { values } from 'lodash';

/**
 * Internal Imports
 */
import './style.css';

export const statusSizes = {
	128: 'circle-size-128',
	64: 'circle-size-64',
	32: 'circle-size-32',
	20: 'circle-size-20',
	12: 'circle-size-12',
};

const StatusCircle = ( { statusCode, circleSize, className } ) => {
	const statusClass = classnames(
		'ee-status-circle',
		'status-bg-' + statusCode,
		circleSize,
		className
	);
	return (
		<span className={ statusClass } />
	);
};

StatusCircle.propTypes = {
	statusCode: PropTypes.string,
	circleSize: PropTypes.oneOf( values( statusSizes ) ),
	className: PropTypes.string,
};
StatusCircle.defaultProps = {
	circleSize: statusSizes[ 12 ]
};

export default StatusCircle;