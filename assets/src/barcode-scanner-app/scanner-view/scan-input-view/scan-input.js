/**
 * External imports
 */
import { forwardRef } from '@wordpress/element';

/**
 * Internal Imports
 */
import { withInstanceId } from '../../../components/higher-order';

/**
 * @type { {$$typeof, render} }
 */
const ScanInput = forwardRef( ( props, ref ) => {
	return <input
		ref={ ref }
		type={ 'text' }
		id={ `eea-scan-input-${ props.instanceId }` }
		{ ...props }
	/>;
} );

export default withInstanceId( ScanInput );
