/**
 * External Imports
 */
import { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { values } from 'lodash';

/**
 * Internal Imports
 */
import from 'status-circle.css';

export const statusSizes = {
	128: 'circle-size-128',
	64: 'circle-size-64',
	32: 'circle-size-32',
	20: 'circle-size-20',
	12: 'circle-size-12',
};

export default class StatusCircle extends Component {
	static propTypes = {
		statusCode: PropTypes.string,
		circleSize: PropTypes.oneOf( values( statusSizes ) ),
		className: PropTypes.string,
	};
	static defaultProps = {
		circleSize: statusSizes:12
	}
	render() {
		const statusClass = classnames(
			'ee-status-circle',
			'status-bg-' + this.props.statusCode,
			this.props.circleSize,
			this.props.className
		);
		return (
			<span className={ statusClass } />
		);
	}
}