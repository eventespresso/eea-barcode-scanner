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

export default class StatusSection extends Component {
	static propTypes = {
		statusLabel: PropTypes.string,
		statusValue: PropTypes.string,
		circleSize: PropTypes.oneOf( values( statusSizes ) ),
		className: PropTypes.string,
		children: PropTypes.any,
		statusCode: PropTypes.string
	};
	render() {
		const {
			statusLabel,
			statusValue,
			circleSize,
			children,
			statusCode,
			className
		} = this.props;
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
	}
}