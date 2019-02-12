/**
 * External imports
 */
import { forwardRef } from 'react';
import { BaseControl } from '@wordpress/components';

/**
 * Internal imports
 */
import { withInstanceId } from '../../higher-order';

const TextControl = forwardRef( ( {
	label,
	value,
	help,
	className,
	instanceId,
	onChange = () => false,
	type = 'text',
	...rest
}, ref ) => {
	const id = `ee-text-control-${ instanceId }`;
	const onChangeValue = ( event ) => onChange( event.target.value );
	return (
		<BaseControl label={ label } id={ id } help={ help }
			className={ className }>
			<input
				className={ 'ee-components-text-control__input' }
				type={ type }
				id={ id }
				ref={ ref }
				value={ value }
				onChange={ onChangeValue }
				aria-describedby={ ! ! help ? '__help' : undefined }
				{ ...rest }
			/>
		</BaseControl>
	);
} );

export default withInstanceId( TextControl );
