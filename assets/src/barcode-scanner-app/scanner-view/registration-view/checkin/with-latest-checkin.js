/**
 * External imports
 */
import { withSelect, withDispatch } from '@wordpress/data';
import { createHigherOrderComponent, compose } from '@wordpress/compose';
import { isModelEntityOfModel } from '@eventespresso/validators';

const withLatestCheckin = createHigherOrderComponent(
	compose( [
		withSelect(
			( select, ownProps ) => {
				const { registration, datetimeId } = ownProps;
				if ( ! isModelEntityOfModel(
					registration,
					'registration'
				) ) {
					return ownProps;
				}
				const { getLatestCheckin } = select( 'eventespresso/core' );
				return {
					checkin: getLatestCheckin( registration.id, datetimeId )
				};
			}
		),
		withDispatch(
			( dispatch, ownProps ) => {
				const { toggleLatestCheckin } = dispatch( 'eventespresso/core' );
				const { registration, datetimeId } = ownProps;
				return {
					onCheckinChange() {
						if (
							isModelEntityOfModel(
								registration,
								'registration'
							)
						) {
							toggleLatestCheckin( registration.id, datetimeId );
						}
					},
				};
			}
		),
	] ),
	'withLatestCheckin'
);

export default withLatestCheckin;
