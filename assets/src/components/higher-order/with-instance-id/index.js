/**
 * WordPress dependencies
 */
import { Component, forwardRef } from 'react';

/**
 * A Higher Order Component used to be provide a unique instance ID by
 * component.  This is a copy of the `@wordpress/component` withInstanceId with
 * the enhancement of forwarding ref to the child component.
 *
 * @param {Component} WrappedComponent The wrapped component.
 *
 * @return {Component} Component with an instanceId prop.
 */
function withInstanceId( WrappedComponent ) {
	let instances = 0;

	class WithInstanceId extends Component {
		constructor() {
			super( ...arguments );
			this.instanceId = instances++;
		}

		render() {
			return (
				<WrappedComponent
					{ ...this.props }
					ref={ this.props.forwardedRef }
					instanceId={ this.instanceId }
				/>
			);
		}
	}

	return forwardRef( ( props, ref ) => {
		return <WithInstanceId { ...props } forwardedRef={ ref } />;
	} );
}

export default withInstanceId;
