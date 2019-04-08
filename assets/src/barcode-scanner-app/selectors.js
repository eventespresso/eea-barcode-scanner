/**
 * External imports
 */
import { Component } from '@wordpress/element';
import { EventSelect, DatetimeSelect } from '@eventespresso/components';
import PropTypes from 'prop-types';

/**
 * Internal imports
 */
import * as slugs from './menu-slugs';

const DEFAULT_QUERY_DATA = {
	limit: 50,
};

export default class Selectors extends Component {
	state = {
		activeSelector: '',
		eventTitle: '',
		selectedEventId: 0,
		dateTimeTitle: '',
		selectedDatetimeId: 0,
	};

	static propTypes = {
		currentStep: PropTypes.string,
		selectedEventId: PropTypes.number,
		selectedDatetimeId: PropTypes.number,
		eventTitle: PropTypes.string,
		dateTimeTitle: PropTypes.string,
		onDataUpdate: PropTypes.func,
	};

	static defaultProps = {
		selectedEventId: 0,
		selectedDatetimeId: 0,
		eventTitle: '',
		dateTimeTitle: '',
		onDataUpdate: () => null,
	};

	setActiveSelector() {
		this.setState( {
			activeSelector: this.props.currentStep,
			selectedEventId: this.props.selectedEventId,
			selectedDatetimeId: this.props.selectedDatetimeId,
			eventTitle: this.props.eventTitle,
			dateTimeTitle: this.props.dateTimeTitle,
		} );
	}

	onEventSelect = ( selectedValue ) => {
		this.props.onDataUpdate( slugs.MENU_CHOOSE_EVENT, selectedValue );
	};

	onDatetimeSelect = ( selectedValue ) => {
		this.props.onDataUpdate( slugs.MENU_CHOOSE_DATETIME, selectedValue );
	};

	getDatesQueryData = () => {
		return {
			...DEFAULT_QUERY_DATA,
			forEventId: this.state.selectedEventId,
			showExpired: true,
		};
	};

	getSelectorTitle() {
		return (
			<div className={ 'eea-bs-ed-selected-title' }>
				{ this.getTitle() }
			</div>
		);
	}

	getTitle() {
		switch ( this.state.activeSelector ) {
			case slugs.MENU_CHOOSE_DATETIME:
				return this.getEventTitle();
			case slugs.MENU_SCAN:
				return [ this.getEventTitle(), this.getDateTimeTitle() ];
			default:
				return '';
		}
	}

	getEventTitle() {
		return (
			<h3 key={ 'event-title' }
				className={ 'eea-bs-ed-selected-event-text' }
			>
				{ this.state.eventTitle }
			</h3>
		);
	}

	getDateTimeTitle() {
		return (
			<h4 key={ 'datetime-title' }
				className={ 'eea-bs-ed-selected-dtt-text' }
			>
				{ this.state.dateTimeTitle }
			</h4>
		);
	}

	getSelectorContainer() {
		return (
			<div className={ 'eea-bs-ed-selector' }>
				{ this.getSelector() }
			</div>
		);
	}

	getSelector() {
		switch ( this.state.activeSelector ) {
			case slugs.MENU_CHOOSE_EVENT:
				return <EventSelect
					selectLabel={ '' }
					onSelect={ this.onEventSelect }
					selected={ this.state.selectedEventId }
					queryData={ DEFAULT_QUERY_DATA }
				/>;
			case slugs.MENU_CHOOSE_DATETIME:
				return <DatetimeSelect
					selectLabel={ '' }
					onSelect={ this.onDatetimeSelect }
					addAllOptionLabel={ '' }
					selected={ this.state.selectedDatetimeId }
					queryData={ this.getDatesQueryData() }
				/>;
			default:
				return '';
		}
	}

	componentDidMount() {
		this.setActiveSelector();
	}

	componentDidUpdate( prevProps ) {
		if ( prevProps.currentStep !== this.props.currentStep ||
			prevProps.selectedEventId !== this.props.selectedEventId ||
			prevProps.selectedDatetimeId !== this.props.selectedDatetimeId
		) {
			this.setActiveSelector();
		}
	}

	render() {
		return (
			<div className="eea-bs-ed-selection-container">
				{ this.getSelectorTitle() }
				{ this.getSelectorContainer() }
			</div>
		);
	}
}
