<?php
/**
 * This is the template for the scanner form.
 *
 * @since
 *
 * Template args available for this template are:
 * @type string $_wpnonce  The created nonce for the scanning app.
 * @type string $action_selector A selector for indicating the default actions when submitted.
 * @type string $button_class The class for the submit button.
 */
?>
<!-- namespace with css -->
<div class="eea-barcode-scanning-container">
	<!-- step display -->
	<div class="eea-bs-main-step-container">
		<hr class="eea-bs-step-line">
		<div class="eea-bs-step-number eea-bs-step-one eea-bs-step-active"><div class="eea-step-bubble"><p>1</p></div><span class="eea-bs-step-text"><?php _e('Choose Event', 'event_espresso'); ?></span></div>
		<div class="eea-bs-step-number eea-bs-step-two"><div class="eea-step-bubble"><p>2</p></div><span class="eea-bs-step-text"><?php _e('Choose Date-time', 'event_espresso'); ?></span></div>
		<div class="eea-bs-step-number eea-bs-step-three"><div class="eea-step-bubble"><p>3</p></div><span class="eea-bs-step-text"><?php _e('Scan', 'event_espresso'); ?></span></div>
	</div>
	<div class="eea-bs-ed-selection-container">
		<div class="eea-bs-ed-selector eea-bs-event-selection">
			<select class="eea-bs-ed-selector-select" name="eea_bs_event_selector" id="eea-bs-event-selector">
				<option value="28">Event A</option>
				<option value="32">Event Some other event</option>
				<option value="56">Premiere event</option>
			</select>
			<div class="eea-bs-ed-selector-selected-text">
				<h3 class="eea-bs-ed-selected-event-text" style="display:none;">Event A</h3>
			</div>
		</div>
		<div class="eea-bs-ed-selector">
			<span class="eea-bs-ed-selector-divider" style="display:none;"></span>
		</div>
		<div class="eea-bs-ed-selector eea-bs-dtt-selection">
			<select class="eea-bs-ed-selector-select" name="eea_bs_dtt_selector" id="eea-bs-dtt-selector" style="display:none;">
				<option value="28">Opening Ceremonies - July 28 @ 10am-10:45am</option>
				<option value="32">Main Session - July 28 @ 11am-12pm</option>
				<option value="56">Closing Session - July 28 @1pm-3pm</option>
			</select>
			<div class="eea-bs-ed-selector-selected-text">
				<h3 class="eea-bs-ed-selected-dtt-text" style="display:none;">Opening Ceremonies - July 28 @ 10am-10:45am</h3>
			</div>
		</div>
	</div>
	<!-- barcode scanning form -->
	<div class="eea-barcode-scanner-form-container" style="display:none;">
		<form name="eea-barcode-scan" action="" method="post">
			<!-- hidden inputs -->
			<input type="hidden" class="eea-barcode-scan-nonce" name="eea_barcode_scan_nonce" value="<?php echo $_wpnonce; ?>">

			<!-- on with the form -->
			<?php echo $action_selector; ?>
			<input type="text" class="eea-barcode-scan-code" name="eea_barcode_scan_code" value="" placeholder="<?php _e('Scan or enter barcode here.', 'event_espresso' ); ?>">
			<input class="<?php echo $button_class; ?>" type="submit" value="<?php _e('Go', 'event_espresso'); ?>"
		</form>
	</div>
	<div class="eea-barcode-scanning-results">
		<!-- used by js -->
	</div>
</div>
