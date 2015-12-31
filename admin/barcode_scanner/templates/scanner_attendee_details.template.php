<?php
/**
 * Template for the attendee details section for barcode scanner.
 *
 * @since %VER%
 * @package  EE4 Barcode Scanner
 * @subpackage template
 *
 * Template Arguments:
 * @type string  $avatar   The profile image for the registrant (usually gravatar).
 * @type EE_Registration $registration  The registration being displayed.
 * @type EE_Transaction  $transaction   The transaction details for this registration.
 * @type EE_Atttendee $contact The contact details for the registration.
 * @type EE_Registration[] $other_regs  This is (if present) an array of $other registrations in a group for the given transaction.
 * @type int $DTT_ID  the id of the datetime for the registration being viewed.
 * @type string $last_checkin  A textual string representing the most recent info on the checkin status for this registration and this datetime.
 * @type string $checkin_button_text  The button text for the registration checkin action.
 * @type string $all_checkin_button_text The button text for changing checkin status of all registrations in group.
 * @type string $checkin_color Class text for the checkin button color.
 */
$answers = $registration->answers();

/**
 * links to registration details, and contact details pages.
 */
$base_url = admin_url( 'admin.php?page=espresso_registrations' );

$reg_url = add_query_arg( array(
	'action' => 'view_registration',
	'_REG_ID' => $registration->ID()
	), $base_url );
$att_url = add_query_arg( array(
	'action' => 'edit_attendee',
	'post' => $contact->ID()
	), $base_url );

$reg_link = sprintf( __( '%1$sView Registration Details%2$s', 'event_espresso'), '<a href="' . $reg_url . '">', '</a>' );
$att_link = sprintf( __( '%1$sView Contact Details%2$s', 'event_espresso' ), '<a href="' . $att_url . '">', '</a>' );

?>
<div class="eea-barcode-scanner-attendee-container">
	<div class="eea-barcode-scanner-contact-header-container">
		<div class="eea-barcode-scanner-avatar-container">
			<?php echo $avatar; ?><br />
			<?php if ( ! empty( $answers ) ) : ?>
				<a href="#eea-bs-view-answers-container" class="eea-bs-slidetoggle eea-bs-view-answers-toggle"><?php _e('View Answers', 'event_espresso'); ?></a><br />
			<?php endif; ?>
		</div>
		<div class="eea-barcode-scanner-attendee-details-container">
			<h3 class="eea-bs-attendee-name">
				<?php $contact->e_full_name(); ?><?php if ( $registration->is_primary_registrant() ) : ?><span class="dashicons dashicons-star-filled"></span><?php endif; ?>
			</h3>
			<section class="eea-bs-contact-email-container">
				<span class="eea-bs-contact-email"><?php echo $contact->email(); ?></span>
			</section>
			<section class="eea-bs-status-container">
				<span class="eea-bs-status-label eea-bs-status-txn"><?php _e('Owing:', 'event_espresso'); ?></span><?php echo $transaction->remaining(); ?><span class="eea-bs-status-circle txn-status-bg-<?php echo $transaction->status_ID(); ?>"></span>
			</section>
			<section class="eea-bs-status-container">
				<span class="eea-bs-status-label eea-bs-status-reg"><?php _e('Reg Status:', 'event_espresso'); ?></span><?php echo $registration->pretty_status(); ?><span class="eea-bs-status-circle reg-status-bg-<?php echo $registration->status_ID(); ?>"></span>
			</section>
			<div style="clear:both"></div>
			<section class="eea-bs-checkout-action-container">
				<span class="eea-bs-checkout-status-date"><?php echo $last_checkin; ?></span>
			</section>
			<section class="eea-bs-checkout-action-container">
				<button data-checkin-button="main" data-reg-url-lnk="<?php echo $registration->reg_url_link(); ?>" class="eea-bs-checkout-action-button big ee-roundish ee-button<?php echo $checkin_color; ?>"><?php echo $checkin_button_text; ?></button>
			</section>
			<div style="clear:both">
				<?php if ( is_user_logged_in() ) : ?>
					<section class="eea-bs-external-links-container">
						<?php echo $reg_link . ' | ' . $att_link; ?>
						<?php if ( count( $other_regs ) > 0 ) : ?>
								| <a href="#eea-bs-view-group-container" class="eea-bs-slidetoggle eea-bs-view-group-toggle"><?php printf( __('View Group (%d)', 'event_espresso'), count( $other_regs ) ); ?></a>
						<?php endif; ?>
					</section>
				<?php endif; ?>
		</div>
		<div style="clear:both"></div>
	</div>
	<div style="clear:both"></div>
	<?php if ( ! empty( $answers ) ) : ?>
		<div id="eea-bs-view-answers-container" class="eea-barcode-scanner-contact-answer-details-container eea-bs-details-container">
			<h4 class="eea-bs-subtitle-label eea-bs-answers-header"><?php _e( 'Registration Form Answers:', 'event_espresso' ); ?></h4>
			<table class="eea-bs-custom-answers-table">
				<tbody>
					<?php foreach ( $answers as $answer ) :
						$question = $answer->question();
						if ( ! $question instanceof EE_Question ) {
							continue;
						}
					 ?>
						<tr>
							<td>
								<span class="eea-bs-question"><?php echo $question->display_text(); ?></span><br>
								<span class="eea-bs-admin-label"><?php echo $question->admin_label(); ?></span>
							</td>
							<td>
								<?php echo $answer->pretty_value(); ?>
							</td>
						</tr>
					<?php endforeach; ?>
				</tbody>
			</table>
		</div>
	<?php endif; ?>
	<div id="eea-bs-view-group-container" class="eea-barcode-scanner-contact-group-container eea-bs-details-container" style="display:none">
		<?php if ( ! empty( $other_regs ) ) : ?>
			<h4 class="eea-bs-subtitle-label eea-bs-group-header"><?php _e('Other people in this group:', 'event_espresso'); ?></h4>
			<table class="eea-bs-group-table eea-bs-table widefat">
				<thead>
					<tr>
						<th>First Name</th>
						<th>Last Name</th>
						<th>Last Update</th>
						<th colspan="2">Status</th>
					</tr>
				</thead>
				<tbody>
					<?php foreach ( $other_regs as $reg ) :
						$checkin = $reg->get_first_related( 'Checkin', array( array( 'DTT_ID' => $DTT_ID ), 'order_by' => array( 'CHK_timestamp' => 'DESC' ) ) );
						$checkin_status = $reg->check_in_status_for_datetime( 0, $checkin );
						$att = $reg->attendee();
						$checkin_button_text = $checkin_status === 1 ? __(' Check Out', 'event_espresso' ) : __('Check In', 'event_espresso');
						$reg_url_link = $reg->reg_url_link();

						/**
						 * The reason for these conditionals is for backward compat with versions of EE core that do not have the check-in status constants defined.
						 */
						$checked_in = defined( 'EE_Registration::checkin_status_in' ) ? EE_Registration::checkin_status_in : 1;
						$checked_out = defined( 'EE_Registration::checkin_status_out' ) ? EE_Registration::checkin_status_out : 2;
						$never_checked = defined( 'EE_Registration::checkin_status_never' ) ? EE_Registration::checkin_status_never : 0;

						switch ( $checkin_status ) {
							case $never_checked :
								$checkin_class = ' dashicons-no';
								$chkin_color = ' ee-green';
								break;
							case $checked_in :
								$checkin_class = ' ee-icon ee-icon-check-in';
								$chkin_color = ' ee-red';
								break;
							case $checked_out :
								$checkin_class = ' ee-icon ee-icon-check-out';
								$chkin_color = ' ee-green';
								break;
						}
					?>
						<tr class="alternate">
							<td><?php echo $att->fname(); ?></td>
							<td><?php echo $att->lname(); ?></td>
							<td><span class="eea-bs-secondary-att-datetime"><?php echo $checkin instanceof EE_Checkin ? $checkin->get_datetime( 'CHK_timestamp', 'M j @ ', 'h:i a' ) : ''; ?></span></td>
							<td><span class="eea-bs-check-icon dashicons <?php echo $checkin_class; ?>"></span></td>
							<td><button data-checkin-button="secondary" data-reg-url-lnk="<?php echo $reg_url_link; ?>" class="eea-bs-checkout-action-button  ee-roundish ee-button<?php echo $chkin_color; ?>"><?php echo $checkin_button_text; ?></button></td>
						</tr>
					<?php endforeach; ?>
				</tbody>
			</table>
			<button data-checkin-button="all" data-reg-url-lnk="<?php echo $registration->reg_url_link(); ?>" class="eea-bs-checkout-action-button big ee-roundish ee-button<?php echo $checkin_color; ?> align-right checkin-all-button"><?php echo $all_checkin_button_text; ?></button>
			<div style="clear:both"></div>
		<?php endif; ?>
	</div>
</div>
