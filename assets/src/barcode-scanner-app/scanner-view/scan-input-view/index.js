/**
 * External imports
 */
import { Component } from 'react';
import { Button } from '@wordpress/components';

export default class ScanInputView extends Component {
	render() {
		return (
			<div className={ 'eea-bs-scan-input-view' }>
				<ScanTypeSelector />
				<ScanInput />
				<Button />
			</div>
		);
	}
};

/**
 * Todo:
 * - Button is a component provided via `@wordpress/components`.  Need to make
 *   sure we're sending along the necessary props for it.
 * - <ScanInput /> will need to handle the scanner listening library and I
 *   think that may get registered in this component (using `ref` and see examples
 *   here: https://reactjs.org/docs/integrating-with-other-libraries.html)
 */
