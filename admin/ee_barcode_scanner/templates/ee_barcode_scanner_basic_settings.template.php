<?php
/* @var $config EE_Barcode_Scanner_Config */
?>
<div class="padding">
	<h4>
		<?php _e('EE_Barcode_Scanner Settings', 'event_espresso'); ?>
	</h4>
	<table class="form-table">
		<tbody>

			<tr>
				<th><?php _e("Reset EE_Barcode_Scanner Settings?", 'event_espresso');?></th>
				<td>
					<?php echo EEH_Form_Fields::select( __('Reset EE_Barcode_Scanner Settings?', 'event_espresso'), 0, $yes_no_values, 'reset_ee_barcode_scanner', 'reset_ee_barcode_scanner' ); ?><br/>
					<span class="description">
						<?php _e('Set to \'Yes\' and then click \'Save\' to confirm reset all basic and advanced Event Espresso EE_Barcode_Scanner settings to their plugin defaults.', 'event_espresso'); ?>
					</span>
				</td>
			</tr>

		</tbody>
	</table>

</div>

<input type='hidden' name="return_action" value="<?php echo $return_action?>">

