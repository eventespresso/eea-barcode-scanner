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
	<!-- barcode scanning form -->
	<div class="eea-barcode-scanner-form-container">
		<form name="eea-barcode-scan" action="" method="post">
			<!-- hidden inputs -->
			<input type="hidden" class="eea-barcode-scan-nonce" name="eea_barcode_scan_nonce" value="<?php echo $_wpnonce; ?>">

			<!-- on with the form -->
			<?php echo $action_selector; ?>
			<input type="text" class="eea-barcode-scan-code" name="eea_barcode_scan_code" value="" placeholder="<?php _e('Scan or enter barcode here.', 'event_espresso' ); ?>">
			<input class="<?php echo $button_class; ?>" type="submit" value="<?php _e('Go', 'event_espresso'); ?>"
		</form>
	</div>
</div>
<div class="eea-barcode-scanning-results">
</div>
