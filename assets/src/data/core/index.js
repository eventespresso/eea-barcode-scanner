/**
 * WordPress dependencies
 */
import { registerStore } from '@wordpress/data';

/**
 * Internal dependencies
 */
import reducer from './reducer';
import * as selectors from './selectors';
import * as actions from './actions';
import controls from './controls';

const REDUCER_KEY = 'eea-barcode-scanner/core'

/**
 * Registers store for 'eventespresso/core'.
 */
export default registerStore( REDUCER_KEY, {
	reducer,
	actions,
	selectors,
	controls,
} );
