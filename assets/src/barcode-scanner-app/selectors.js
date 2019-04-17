/**
 * External imports
 */
import { EventSelect, DatetimeSelect } from '@eventespresso/components';
import PropTypes from 'prop-types';

/**
 * Internal imports
 */
import * as slugs from './menu-slugs';

const DEFAULT_QUERY_DATA = {
	limit: 50,
};

const getEventTitle = ( currentStep, eventTitle ) => {
	return currentStep === slugs.MENU_CHOOSE_DATETIME ||
		currentStep === slugs.MENU_SCAN ? (
			<h3
				key={ 'event-title' }
				className={ 'eea-bs-ed-selected-event-text' }
			>
				{ eventTitle }
			</h3>
		) : null;
};

const getDateTimeTitle = ( currentStep, dateTimeTitle ) => {
	return currentStep === slugs.MENU_SCAN ? (
		<h4 key={ 'datetime-title' }
			className={ 'eea-bs-ed-selected-dtt-text' }
		>
			{ dateTimeTitle }
		</h4>
	) : null;
};

const getEventSelector = ( currentStep, onChange, eventId ) => {
	return currentStep === slugs.MENU_CHOOSE_EVENT ?
		<EventSelect
			selectLabel={ '' }
			onSelect={ onChange }
			selected={ eventId }
			queryData={ DEFAULT_QUERY_DATA }
			className={ 'eea-bs-ed-event-select' }
		/> : null;
};

const getDatetimeSelector = ( currentStep, onChange, eventId, datetimeId ) => {
	return currentStep === slugs.MENU_CHOOSE_DATETIME ?
		<DatetimeSelect
			selectLabel={ '' }
			onSelect={ onChange }
			addAllOptionLabel={ '' }
			selected={ datetimeId }
			queryData={ {
				...DEFAULT_QUERY_DATA,
				forEventId: eventId,
				showExpired: true,
			} }
			className={ 'eea-bs-ed-datetime-select' }
		/> : null;
};

const Selectors = ( {
	currentStep,
	eventId,
	datetimeId,
	eventTitle,
	dateTimeTitle,
	onEventChange,
	onDatetimeChange,
} ) => {
	return (
		<div className="eea-bs-ed-selection-container">
			<div className={ 'eea-bs-ed-selected-title' }>
				{ getEventTitle( currentStep, eventTitle ) }
				{ getDateTimeTitle( currentStep, dateTimeTitle ) }
			</div>
			<div className={ 'eea-bs-ed-selector' }>
				{ getEventSelector( currentStep, onEventChange, eventId ) }
				{
					getDatetimeSelector(
						currentStep,
						onDatetimeChange,
						eventId,
						datetimeId
					)
				}
			</div>
		</div>
	);
};

Selectors.propTypes = {
	currentStep: PropTypes.string,
	eventId: PropTypes.number,
	datetimeId: PropTypes.number,
	eventTitle: PropTypes.string,
	dateTimeTitle: PropTypes.string,
	onEventChange: PropTypes.func,
	onDatetimeChange: PropTypes.func,
};

Selectors.defaultProps = {
	currentStep: slugs.MENU_CHOOSE_EVENT,
	eventId: 0,
	datetimeId: 0,
	eventTitle: '',
	dateTimeTitle: '',
	onEventChange: () => null,
	onDatetimeChange: () => null,
};

export default Selectors;

