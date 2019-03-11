/**
 * External imports
 */
import { NoticeList } from '@wordpress/components';
import { withSelect, withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';

export function ScannerNotices( { notices, ...props } ) {
	return (
		<NoticeList notices={ notices } { ...props } />
	);
}

export default compose( [
	withSelect( ( select ) => ( {
		notices: select( 'core/notices' ).getNotices(),
	} ) ),
	withDispatch( ( dispatch ) => ( {
		onRemove: dispatch( 'core/notices' ).removeNotice,
	} ) ),
] )( ScannerNotices );
