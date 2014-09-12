jQuery(document).ready(function($) {

	/**
	 * Scanner object helper.
	**/
	var eebsHelper = {

		eventSelector : null,
		eventSelectorChosen : null,
		eventName : null,
		currentStep: null,
		dttSelector : null,
		dttSelectorChosen : null,
		dttName : null,
		selectorDivider : null,
		scanner : null,
		scannerField: null,
		scannerLoaded : false,
		attendeeLookup : null,
		isAdmin : true,
		spinner : null,
		addedEventAjaxCallback : false,
		data : {
			ee_reg_code : '',
			evtName : '',
			EVT_ID : 0,
			dttName : '',
			DTT_ID : 0,
			dttCount : 0,
			dttselector : '',
			action : 'ee_barcode_scanner_main_action',
			ee_scanner_action : ''
		},
		noticesContainer : $('.eea-barcode-notices'),

		/**
		 * scanner detection options
		 */
		//scanning complete activity, true means scan triggers look up of registration.  False, means scan toggles registration check in status for scan.
		lookUp : true,
		scannerOptions : {
			//Callback after receive a char (original keypress event in parameter)
			timeBeforeScanTest : 100,
			//Average time (ms) between 2 chars. Used to do difference between keyboard typing and scanning
			avgTimeByChar : 30,
			//Minimum length for a scanning
			minLength : 6,
			//Chars to remove and means end of scanning
			endChar : [9,13],
			//Stop immediate propagation on keypress event
			stopPropagation : true,
			//Prevent default action on keypress event
			preventDefault : false
		},


		/**
		 * initialize helper on page load
		 *
		 * @return {void}
		 */
		init : function() {
			//ensure chosen is setup on the selects
			if ( typeof $.fn.chosen === 'function' ) {
				this.loadChosen();
			}

			//set context
			this.isAdmin = $('#eea-barcode-scan-context').val() == 'admin' ? true : false;
			this.eventName = $('.eea-bs-ed-selected-event-text');
			this.dttName = $('.eea-bs-ed-selected-dtt-text');
			this.scanner = $('.eea-barcode-scanner-form-container');
			this.scannerField = $('.eea-barcode-scan-code');
			this.attendeeLookup = $('.eea-barcode-scanning-results');
			this.spinner = '.spinner';
			this.currentStep = 1;
			this.selectorDivider = $('.eea-bs-ed-selector-divider');
			this.data._wpnonce = $('#eea-barcode-scan-nonce').val();
		},



		/**
		 * Loads the chosen jQuery library for fancy selectors.
		 *
		 * @return {void}
		 */
		loadChosen : function() {
			if ( this.eventSelector === null && $('#eea_bs_event_selector').length ) {
				this.eventSelector = $('#eea_bs_event_selector');
				this.eventSelector.chosen().change( function(){
					eebsHelper.toggleEventSelector(false);
				});
				this.eventSelectorChosen = $('#eea_bs_event_selector_chosen');
			}

			if ( this.dttSelector === null && $('#eea_bs_dtt_selector').length ) {
				this.dttSelector = $('#eea_bs_dtt_selector');
				this.dttSelector.chosen().change( function() {
					eebsHelper.loadScanner();
				this.dttSelectorChosen = $('#eea_bs_dtt_selector_chosen');
				});
			} else if ( this.dttSelector !== null ) {
				this.dttSelector.trigger("chosen:updated");
			}
		},





		/**
		 * Initializes the scanner library and shows the scanner form.
		 *
		 * @return {void}
		 */
		loadScanner : function() {
			this.advanceStep();
			this.scanner.show();
			this.scannerField.focus();

			//iniitalizeScanner (if it hasn't been already).
			if ( ! this.scannerLoaded ) {
				this.scannerField.scannerDetection( this.scannerOptions );
				//register callbacks.
				this.scannerField
					.bind( 'scannerDetectionComplete', function( e, data ) { eebsHelper.scannerComplete( e, data ); } )
					.bind( 'scannerDetectionError', function( e, data ) { eebsHelper.scannerError( e, data ); } )
					.bind( 'scannerDetectionReceive', function( e, data ) { eebsHelper.scannerReceive(e, data); } );
				//set loaded flag
				this.scannerLoaded = true;
			}
			return;
		},



		/**
		 * Callback for scannerDetection "scannerDetectionComplete" event.
		 *
		 * @param {scannerDetectionComplete} event
		 * @param {object} data
		 *
		 * @return {void}
		 */
		scannerComplete : function( event, data ) {
			this.data.ee_reg_code = data.string;
			this.data.ee_scanner_action = this.lookUp ? 'lookup_attendee' : 'toggle_attendee';
			this.doAjax( this.attendeeLookup );
			return;
		},



		/**
		 * Callback for scannerDetection "scannerDetectionError" event.
		 *
		 * @param {scannerDetectionError} event
		 * @param {object} data
		 *
		 * @return {void}
		 */
		scannerError : function( event, data ) {
			//not doing anything currently until I know when this shows up and figure out what we'll do with scanner error.  It's possible the existing error notices will be sufficient?
			return;
		},




		/**
		 * Callback for scannerDetection "scannerDetectionRecieve" event.
		 *
		 * @param {scannerDetectionReceive} event
		 * @param {object} data
		 *
		 * @return {void}
		 */
		scannerReceive : function( event, data ) {
			$(this.spinner, '.eea-barcode-scanner-form-container').show();
			this.attendeeLookup.html('').hide();
			return;
		},




		/**
		 * Toggle the event selector and related actions
		 *
		 * @param {bool} show Whether showing or hiding event selector
		 *
		 * @return {void}
		 */
		toggleEventSelector : function( show ) {
			show = typeof show === 'undefined' ? true : show;

			if ( show ) {
				this.advanceStep( true );
				//hide the event name and show the event selector.
				this.eventName.hide();

				this.eventSelectorChosen.show();

				//toggle the dtt selector (hide) (and the dtt name)
				this.toggleDTTSelector( false );
				//hide the scanner
				this.scanner.hide();
				//clear the attendee lookup
				this.attendeeLookup.html('');
			} else {
				//grab the selected event name and add to dom and then show event name.
				this.data.evtName = $('option[value="' + this.eventSelector.val() + '"]', this.eventSelector).text();
				this.eventName.text( this.data.evtName ).show();

				//hide the event selector
				this.eventSelectorChosen.hide();

				this.selectorDivider.show();

				//show ajax spinner
				$( this.spinner, '.eea-bs-dtt-selection' ).show();

				//grab the event id and grab dtt selector or name via ajax
				this.data.EVT_ID = this.eventSelector.val();
				this.data.ee_scanner_action = 'retrieve_datetimes';

				//put/replace DTTselector in dom and then loadChosen.
				if ( ! this.addedEventAjaxCallback ) {
					this.addedEventAjaxCallback = true;
					$(document).ajaxSuccess( function( event, xhr, ajaxoptions ) {
						//we can get the response from xhr
						var ct = xhr.getResponseHeader("content-type") || "";
						if ( ct.indexOf('json') > -1 ) {
							var resp = xhr.responseText;
							resp = $.parseJSON(resp);
							//if we've got ee_scanner_action and it does NOT equal this action... let's get out.
							if ( typeof resp.data === 'undefined' || typeof resp.data.ee_scanner_action === 'undefined' || resp.data.ee_scanner_action != 'retrieve_datetimes' ) {
								return;
							}
							//let's handle toggling all the elements if we had a successful switch!
							if ( resp.success ) {
								eebsHelper.data.dttName = typeof resp.data.dtt_name !== 'undefined' ? resp.data.dtt_name : '';
								eebsHelper.data.DTT_ID = typeof resp.data.DTT_ID !== 'undefined' ? resp.data.DTT_ID : 0;
								eebsHelper.data.dttCount = typeof resp.data.dtt_count !== 'undefined' ? resp.data.dtt_count  : 0;
								eebsHelper.data.dttselector = typeof resp.content !== 'undefined' ? resp.content : '';
								eebsHelper.toggleDTTSelector();
							} else {
								eebsHelper.toggleEventSelector();
								return;
							}
						}
					} );
				}
				this.doAjax();
			}
			return;
		},





		/**
		 * toggle the Date and Time selector and related actions
		 *
		 * @param {bool} show show or hide
		 *
		 * @return {void}
		 */
		toggleDTTSelector : function( show ) {
			show = typeof show === 'undefined' ? true : show;
			if ( show ) {
				this.advanceStep();
				if ( this.data.dttCount > 1 ) {
					$('.eea-bs-dtt-selection').html( this.data.dttselector ).show();
					this.loadChosen();
				} else {
					this.toggleDTTname();
				}
			} else {
				//hide dttselector and name containers.
				if ( this.dttSelector !== null ) {
					this.dttSelector.hide();
					this.dttSelectorChosen.hide();
				}
				this.selectorDivider.hide();
				this.toggleDTTname(false);
				this.scanner.hide();
			}
			return;
		},



		/**
		 * toggles the datetime name.
		 */
		toggleDTTname : function( show ) {
			show = typeof show === 'undefined' ? true : show;
			if ( show ) {
				if ( this.data.dttName === ''  ) {
					this.data.dttName = $('option[value="' + this.dttSelector.val() + '"]', this.dttSelector).text();
					this.data.dttID = this.dttSelector.val();
				}
				this.dttName.text(this.data.dttName).show();
				this.loadScanner();
			} else {
				this.dttName.html('').hide();
				this.data.dttID = 0;
				this.data.dttName = '';
			}
			return;
		},




		/**
		 * Takes care of advancing the step indicators in ui.
		 *
		 * @param {bool} reset if resetting to first step set as true.
		 *
		 * @return {void}
		 */
		advanceStep : function( reset ) {
			reset = typeof reset === 'undefined' ? false : reset;
			//remove class on existing step
			$('.eea-bs-step-' + this.currentStep ).removeClass( 'eea-bs-step-active' );
			this.currentStep = reset ? 1 : this.currentStep + 1;
			//add class to new step
			$('.eea-bs-step-' + this.currentStep ).addClass( 'eea-bs-step-active' );
			return;
		},



		/**
		 * This handles the trigger action from someone clicking a step.
		 *
		 * @param {string} stepel This is the element for the triggered step
		 *
		 * @return {void}
		 */
		triggerStep : function( stepel ) {
			//first check if clicked step is active, if it is do nothing.
			if ( $(stepel).hasClass( 'eea-bs-step-active' ) ) {
				return;
			}

			//okay not active so let's find out what step
			var data = $(stepel).data();
			var stepnum = typeof data.stepNum !== 'undefined' ? data.stepNum : '1';

			switch ( stepnum ) {
				case 1 :
					eebsHelper.toggleEventSelector();
					break;
				case 2 :
					if ( eebsHelper.data.dttName === '' && eebsHelper.dttSelector === null ) {
						return;
					} else if ( eebsHelper.data.dttName !== '' && eebsHelper.dttSelector === null ) {
						return;
					} else {
						eebsHelper.toggleDTTSelector();
					}
					break;
			}
			return;

		},




		/**
		 * This is the method triggered by clicking a eea-bs-slidetoggle link.
		 *
		 * @param {string} contEl The .eea-bs-slidetoggle element clicked.
		 *
		 * @return {void}
		 */
		toggleContainer : function( contEl ) {
			if ( typeof contEl === 'undefined' ) {
				return;
			}
			var target = $(contEl).attr('href');
			$(target).slideToggle();
			return;
		},




		/**
		 * The ajax helper method for all ajax calls.
		 *
		 * @return {void}
		 */
		doAjax: function( where ) {

			if ( this.isAdmin ) {
				this.data.ee_admin_ajax = true;
			} else {
				this.data.ee_front_ajax = true;
			}

			where = typeof where !== 'object'  ? false : where;

			$.ajax({
				type: "POST",
				url: ajaxurl,
				data: this.data,
				success: function(response, status, xhr) {
					var ct = xhr.getResponseHeader("content-type") || "";
					if (ct.indexOf('html') > -1) {
						eebsHelper.noticesContainer.html(response);
					}

					if (ct.indexOf('json') > -1 ) {
						var resp = response;
						//note that there should be registered ajaxSuccess callbacks for methods doing anything different.  However, below are the common actions.
						eebsHelper.noticesContainer.html( resp.notices );
						$('.espresso-notices').show();
						if ( where && typeof resp.content !== 'undefined' ) {
							where.html( resp.content );
							where.show();
						}
						$(eebsHelper.spinner).hide();
					}
				}
			});
			return false;
		},

	}

	//startUp scanner handler
	eebsHelper.init();


	/**
	 * capture default scanner action changes and set the relevant property on the scanner helper.
	 *
	 * @since %VER%
	 * @param {object} e event
	 *
	 * @return {void}
	 */
	$('.eea-barcode-scanner-form-container').on( 'change', '#scanner_form_default_action', function(e) {
		e.stopPropagation();
		var action = $(this).val();
		eebsHelper.lookUp = action == 'auto' ? false : true;
	} );



	/**
	 * Capture form submt
	 *
	 * @since %VER%
	 * @param {event} e
	 *
	 * @return {void}
	 */
	$('.eea-barcode-scanner-form-container').on('submit', '#eea-barcode-scanner-form', function(e) {
		e.preventDefault();
		e.stopPropagation();
		var data = {};
		data.string = $('.eea-barcode-scan-code').val();
		eebsHelper.scannerComplete('', data );
	});



	/**
	 * Capture step ui clicks
	 *
	 * @since %VER%
	 *
	 * @return {void}
	 */
	$('.eea-bs-main-step-container').on('click', '.eea-bs-step-number', function(e) {
		e.stopPropagation();
		eebsHelper.triggerStep( this );
		return;
	});



	/**
	 * trigger for extra info containers (view group, view answers)
	 *
	 * @since %VER%
	 *
	 * @return {void}
	 */
	$('.eea-barcode-scanning-results').on('click', '.eea-bs-slidetoggle', function() {
		eebsHelper.toggleContainer( this );
		return;
	});



});
