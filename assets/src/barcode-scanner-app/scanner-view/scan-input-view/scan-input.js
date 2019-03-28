/**
 * External imports
 */
import { forwardRef } from '@wordpress/element';
import { omit } from 'lodash';

/**
 * Internal Imports
 */
import { withInstanceId } from '../../../components/higher-order';

/**
 * @type { {$$typeof, render} }
 */
const ScanInput = forwardRef( ( props, ref ) => {
	const otherProps = omit( props, [ 'forwardedRef', 'instanceId' ] );
	const { onChange = () => null } = otherProps;
	return <input
		ref={ ref }
		type={ 'text' }
		id={ `eea-scan-input-${ props.instanceId }` }
		onChange={ onChange }
		{ ...otherProps }
	/>;
} );

export default withInstanceId( ScanInput );
