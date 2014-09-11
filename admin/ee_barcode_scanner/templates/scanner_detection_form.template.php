<?php
/**
 * This is the template for the scanner form.
 *
 * @since
 *
 * Template args available for this template are:
 * @type string $_wpnonce  The created nonce for the scanning app.
 * @type int      $step           what step is active (1, 2 or 3)... depends on whether there are datetimes or not.
 * @type string  $context      The context where this form is being loaded ('admin' or 'frontend' );
 * @type string $event_name If present (and $event_selector is empty) then we just display the event name (not the selector).
 * @type string $event_selector  If present then the event selector is shown.
 * @type string $dtt_selector   If there is only one event, then this will contain the datetimes on that event (if multiples datetimes.)
 * @type string $dtt_name       If there is only one datetime then this will have the name of that datetime.
 * @type int     $dtt_id 		If there is only one datetime then this will have the id of the dtt.
 * @type string $action_selector A selector for indicating the default actions when submitted.
 * @type string $button_class The class for the submit button.
 */
$eeactivestep1 = $step === 1 ? ' eea-bs-step-active' : '';
$eeactivestep2 = $step === 2 ? ' eea-bs-step-active' : '';
$eeactivestep3 = $step === 3 ? ' eea-bs-step-active' : '';
$eventdisplay = empty( $event_name ) ? ' style="display:none;"' : '';
$dtt_display = empty( $dtt_name ) ? ' style="display:none;"' : '';
$divider_display = empty( $dtt_name ) ? ' style="display:none;"' : '';
$scanner_display = !empty( $dtt_name ) && ! empty( $event_name ) ? '' : ' style="display:none;"';
?>
<!-- namespace with css -->
<div class="eea-barcode-scanning-container">
	<!-- notices -->
	<div class="eea-barcode-notices"><!--used by js --></div>
	<!-- step display -->
	<div class="eea-bs-main-step-container">
		<hr class="eea-bs-step-line">
		<div data-step-num="1" class="eea-bs-step-number eea-bs-step-1<?php echo $eeactivestep1; ?>"><div class="eea-step-bubble"><p>1</p></div><span class="eea-bs-step-text"><?php _e('Choose Event', 'event_espresso'); ?></span></div>
		<div data-step-num="2" class="eea-bs-step-number eea-bs-step-2<?php echo $eeactivestep2; ?>"><div class="eea-step-bubble"><p>2</p></div><span class="eea-bs-step-text"><?php _e('Choose Date-time', 'event_espresso'); ?></span></div>
		<div data-step-num="3" class="eea-bs-step-number eea-bs-step-3<?php echo $eeactivestep3; ?>"><div class="eea-step-bubble"><p>3</p></div><span class="eea-bs-step-text"><?php _e('Scan', 'event_espresso'); ?></span></div>
	</div>
	<div class="eea-bs-ed-selection-container">
		<div class="eea-bs-ed-selector eea-bs-event-selection">
			<span class="spinner"></span>
			<?php echo $event_selector; ?>
			<div class="eea-bs-ed-selector-selected-text">
				<h3 class="eea-bs-ed-selected-event-text"<?php echo $eventdisplay; ?>><?php echo $event_name; ?></h3>
			</div>
		</div>
		<div class="eea-bs-ed-selector">
			<span class="eea-bs-ed-selector-divider"<?php echo $divider_display; ?>></span>
		</div>
		<div class="eea-bs-ed-selector eea-bs-dtt-selection">
			<span class="spinner"></span>
			<?php echo $dtt_selector; ?>
			<?php if ( ! empty( $dtt_id ) ) : ?>
				<input type="hidden" name="eea_bs_dtt_selector" value="<?php echo $dtt_id; ?>">
			<?php endif; ?>
			<div class="eea-bs-ed-selector-selected-text">
				<h3 class="eea-bs-ed-selected-dtt-text"<?php echo $dtt_display; ?>><?php echo $dtt_name; ?></h3>
			</div>
		</div>
	</div>
	<!-- barcode scanning form -->
	<div class="eea-barcode-scanner-form-container"<?php echo $scanner_display; ?>>
		<form id="eea-barcode-scanner-form" name="eea-barcode-scan" action="" method="post">
			<!-- hidden inputs -->
			<input type="hidden" id="eea-barcode-scan-nonce" name="eea_barcode_scan_nonce" value="<?php echo $_wpnonce; ?>">
			<input type="hidden" id="eea-barcode-scan-context" name="eea_barcode_scan_context" value="<?php echo $context; ?>">

			<!-- on with the form -->
			<?php echo $action_selector; ?>
			<input type="text" class="eea-barcode-scan-code" name="eea_barcode_scan_code" value="" placeholder="<?php _e('Scan or enter barcode here.', 'event_espresso' ); ?>">
			<input class="<?php echo $button_class; ?>" type="submit" value="<?php _e('Go', 'event_espresso'); ?>"
			<span class="spinner"></span>
		</form>
	</div>
	<div class="eea-barcode-scanning-results">
		<!-- used by js -->
	</div>
</div>
