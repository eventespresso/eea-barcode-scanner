/**
 * External imports
 */
import { withSelect, withDispatch } from '@wordpress/data';
import { createHigherOrderComponent, compose } from '@wordpress/compose';
import { isModelEntityOfModel } from '@eventespresso/validators';

const withLatestCheckin = createHigherOrderComponent(
	compose( [
		withSelect(
			( select, { registration, datetimeId } ) => {
				if ( ! isModelEntityOfModel(
					registration,
					'registration'
				) ) {
					{}
				}
				const { getLatestCheckin } = select( 'eventespresso/core' );
				const { hasFinishedResolution } = select( 'core/data' );
				return {
					checkinEntity: getLatestCheckin( registration.id, datetimeId ),
					hasResolvedCheckin: hasFinishedResolution(
						'eventespresso/core',
						'getLatestCheckin',
						[ registration.id, datetimeId ]
					),
				};
			}
		),
		withDispatch(
			( dispatch, { registration, datetimeId } ) => {
				const { toggleCheckin } = dispatch( 'eventespresso/core' );
				return {
					onClick() {
						if (
							isModelEntityOfModel(
								registration,
								'registration'
							)
						) {
							toggleCheckin( registration.id, datetimeId );
						}
					},
				};
			}
		),
	] ),
	'withLatestCheckin'
);

export default withLatestCheckin;
