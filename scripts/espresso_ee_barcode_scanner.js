jQuery(document).ready(function($) {

	/**
	 * Scanner object helper.
	**/
	var eebsHelper = {

		eventSelector : null,
		eventName : null,
		dttSelector : null,
		dttName : null,
		scanner : null,
		scannerLoaded : false,
		attendeeLookup : null,
		isAdmin : true,
		spinner : null,
		data : {
			regcode : '',
			evtName : '',
			EVT_ID : 0,
			dttName : '',
			DTT_ID : 0,
			dttCount : 0,
			dttselector : '',
			action : 'ee_barcode_scanner_main_action',
			ee_scanner_action : ''
		},
		noticesContainer : $('#ajax-notices-container'),

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
			preventDefault : true
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
			this.attendeeLookup = $('.eea-barcode-scanning-results');
			this.spinner = '.spinner';
		},



		/**
		 * Loads the chosen jQuery library for fancy selectors.
		 *
		 * @return {void}
		 */
		loadChosen : function() {
			if ( typeof eventSelector === 'null' && $('#eea_bs_event_selector').length ) {
				this.eventSelector = $('#eea_bs_event_selector');
				this.eventSelector.chosen().change( function(){
					eebsHelper.toggleEventSelector(false);();
				});
			}

			if ( typeof dttSelector === 'null' && $('#eea_bs_dtt_selector').length ) {
				this.dttSelector = $('#eea_bs_dtt_selector');
				this.dttSelector.chosen().change( function() {
					eebsHelper.loadScanner();
				});
			} else if ( this.dttSelector.length ) {
				this.dttSelector.trigger("chosen:updated");
			}
		},





		/**
		 * Initializes the scanner library and shows the scanner form.
		 *
		 * @return {void}
		 */
		loadScanner : function() {
			this.scanner.show();

			//iniitalizeScanner (if it hasn't been already).
			if ( ! this.scannerLoaded ) {
				this.scanner.scannerDetection( this.scannerOptions );
				//register callbacks.
				this.scanner
					.bind( 'scannerDetectionComplete', this.scannerComplete( e,data ) )
					.bind( 'scannerDetectionError', this.scannerError( e, data ) )
					.bind( 'scannerDetectionReceive', this.scannerReceive( e, data ) );
				//set loaded flag
				this.scannerLoaded = true;
			}
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
			this.data.regcode = data.string;
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
			this.spinner.show();
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
			show = typeof show === 'undefined' ? true : false;

			if ( show ) {
				//hide the event name and show the event selector.
				this.eventName.hide();
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
				this.eventSelector.hide();

				//show ajax spinner
				$( this.spinner, 'eea-bs-dtt-selection' ).show();

				//grab the event id and grab dtt selector or name via ajax
				this.data.EVT_ID = this.eventSelector.val();
				this.data.ee_scanner_action = 'retrieve_datetimes';

				//put/replace DTTselector in dom and then loadChosen.
				$(document).ajaxSuccess( function( event, xhr, ajaxoptions ) ) {
					//we can get the response from xhr
					var ct = xhr.getResponseHeader("content-type") || "";
					if ( ct.indexOf('json') > -1 ) {
						var resp = xhr.responseText;
						resp = $.parseJSON(resp);
						//let's handle toggling all the elements if we had a successful switch!
						if ( resp.success ) {
							eebsHelper.data.dttName = typeof resp.data.dtt_name !== 'undefined' ? resp.data.dtt_name : '';
							eebsHelper.data.DTT_ID = typeof resp.data.DTT_ID !== 'undefined' ? resp.data.DTT_ID ? 0;
							eebsHelper.data.dttCount = typeof resp.data.dtt_count !== 'undefined' ? resp.data.dtt_count  : 0;
							eebsHelper.data.dttselector = typeof resp.content !== 'undefined' ? resp.content : '';
							eebsHelper.toggleDTTSelector();
						} else {
							eebsHelper.toggleEventSelector();
							return;
						}
					}
				}
				this.doAjax();
			}
		},





		/**
		 * toggle the Date and Time selector and related actions
		 *
		 * @param {bool} show show or hide
		 *
		 * @return {void}
		 */
		toggleDTTSelector : function( show ) {
			show = typeof show === 'undefined' ? true : false;

			if ( show ) {
				if ( this.data.dttCount > 1 ) {
					$('.eea-bs-dtt-selection').html( this.data.dttselector ).show();
					this.loadChosen();
				} else {
					this.toggleDTTname();
				}
			} else {
				//hide dttselector and name containers.
				this.dttSelector.hide();
				this.toggleDTTname(false);
				this.scanner.hide();
			}
		},



		/**
		 * toggles the datetime name.
		 */
		toggleDTTname : function( show ) {
			show = typeof show === 'undefined' ? true : false;
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
		}




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
						this.noticesContainer.html(response,setup.where,setup.what);
					}

					if (ct.indexOf('json') > -1 ) {
						var resp = response;
						//note that there should be registered ajaxSuccess callbacks for methods doing anything different.  However, below are the common actions.
						eebsHelper.noticesContainer.html( resp.notices );
						if ( where && typeof resp.content !== 'undefined' ) {
							where.html( resp.content );
						}
						$(eebsHelper.spinner).hide();
					}
				}
			});
			return false;
		},

	}

	//startUp scanner handler
	eebsHelper::init();


	/**
	 * capture default scanner action changes and set the relevant property on the scanner helper.
	 *
	 * @param {object} e event
	 *
	 * @return {void}
	 */
	$(.'ee-barcode-scanner-form-container').on( 'change', '#scanner_form_default_action', function(e) {
		e.stopPropagation();
		var action = this.val();
		eebsHelper.lookUp = action == 'auto' ? false : true;
	} );

});
