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
		attendeeLookup : null,
		isAdmin : true,

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
		},


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



		loadScanner : function() {
			//showScanner
			//iniitalizeScanner (if it hasn't been already).
		},


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
				//grab the selected event name and add to dom
				//show the event name
				//hide the event selector
				//show ajax spinner
				//grab the event id and grab dtt selector or name via ajax
				//put/replace DTTselector in dom and then loadChosen.
				//toggle the dtt selector (or show dtt name if only one dtt)
			}
		}



		toggleDTTSelector : function( show ) {
			show = typeof show === 'undefined' ? true : false;

			if ( show ) {
				//if dtt selector show dtt selector, otherwise show name.
				//if dttname shown then loadScanner.
			} else {
				//hide dttselector and name containers.
			}
		}



		do_ajax: function(data) {

			if ( this.isAdmin ) {
				data.ee_admin_ajax = true;
			} else {
				data.ee_front_ajax = true;
			}

			$.ajax({
				type: "POST",
				url: ajaxurl,
				data: data,
				success: function(response, status, xhr) {
					var ct = xhr.getResponseHeader("content-type") || "";
					if (ct.indexOf('html') > -1) {
						MSG_helper.display_content(response,setup.where,setup.what);
					}

					if (ct.indexOf('json') > -1 ) {
						var resp = response,
						wht = typeof(resp.data.what) === 'undefined' ? setup.what : resp.data.what,
						whr = typeof(resp.data.where) === 'undefined' ? setup.where : resp.data.where,
						display_content = resp.error ? resp.error : resp.content;

						display_content = resp.error ? resp.error : resp.content;

						if ( whr == '#ajax-notices-container' && resp.notices !== '' ) {
							wht = 'append';
						}

						MSG_helper.display_notices(resp.notices);
						MSG_helper.display_content(display_content, whr, wht);
					}
				}
			});
			return false;
		},



	}


});
