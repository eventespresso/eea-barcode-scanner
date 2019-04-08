/**
 * External Imports
 */
import { Component } from '@wordpress/element';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { values } from 'lodash';

/**
 * Internal Imports
 */
import { StatusCircle, statusSizes } from './';

const StatusSection = ( {
	statusLabel,
	statusValue,
	circleSize,
	className,
	children,
	statusCode,
} ) => {
	const containerClass = classnames(
		className, 'ee-status-section-container'
	);
	const circleProps = { statusLabel, statusCode, circleSize };

	return (
		<section className={ containerClass }>
			<span className={ 'ee-status-section-label' }>
				{ statusLabel }
			</span>{ statusValue }
			{ children }
			<StatusCircle { ...circleProps } />
		</section>
	);
};

StatusSection.propTypes = {
	statusLabel: PropTypes.string.isRequired,
	statusValue: PropTypes.string.isRequired,
	circleSize: PropTypes.oneOf( values( statusSizes ) ),
	className: PropTypes.string,
	children: PropTypes.any,
	statusCode: PropTypes.string.isRequired
};

StatusSection.defaultProps = {
	circleSize: statusSizes['20'],
	className: '',
	children: null,
};

export default StatusSection;