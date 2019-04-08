/**
 * External imports
 */
import { forwardRef } from '@wordpress/element';
import { omit } from 'lodash';
import PropTypes from 'prop-types';

/**
 * Internal Imports
 */
import { withInstanceId } from '../../../components/higher-order';

const ScanInput = forwardRef( ( props, ref ) => {
	const otherProps = omit( props, [ 'forwardedRef', 'instanceId' ] );
	const { onChange } = otherProps;
	return <input
		ref={ ref }
		type={ 'text' }
		id={ `eea-scan-input-${ props.instanceId }` }
		onChange={ onChange }
		{ ...otherProps }
	/>;
} );

ScanInput.propTypes = {
	instanceId: PropTypes.number,
	onChange: PropTypes.func,
};

ScanInput.defaultProps = {
	instanceId: 0,
	onChange: () => null,
};

export default withInstanceId( ScanInput );
