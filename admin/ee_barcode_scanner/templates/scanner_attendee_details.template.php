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
 */
?>
<div class="eea-barcode-scanner-attendee-container">
	<div class="eea-barcode-scanner-contact-header-container">
		<div class="eea-barcode-scanner-avatar-container">
			<?php echo get_avatar('darren@roughsmootheng.in','128', 'mystery'); ?><br />
			<a href="#eea-bs-view-answers-container" class="eea-bs-slidetoggle eea-bs-view-answers-toggle">View Answers</a><br />
			<a href="#eea-bs-view-group-container" class="eea-bs-slidetoggle eea-bs-view-group-toggle">View Group (4)</a>
		</div>
		<div class="eea-barcode-scanner-attendee-details-container">
			<h3 class="eea-bs-attendee-name">
				Luke Skywalker <span class="dashicons dashicons-star-filled"></span>
			</h3>
			<h4 class="eea-bs-subtitle-label eea-bs-event-name"><span class="dashicons dashicons-calendar"></span>Grand Prix Podracing</h4>
			<section class="eea-bs-status-container">
				<span class="eea-bs-status-label eea-bs-status-txn">Owing:</span>$10.00<span class="eea-bs-status-circle txn-status-bg-TIN"></span>
			</section>
			<section class="eea-bs-status-container">
				<span class="eea-bs-status-label eea-bs-status-reg">Reg Status:</span>Approved<span class="eea-bs-status-circle reg-status-bg-RAP"></span>
			</section>
			<div style="clear:both"></div>
			<section class="eea-bs-checkout-action-container">
				<span class="eea-bs-checkout-status-date">Last checkout out on Jul 10 @ 10:30am</span>
			</section>
			<section class="eea-bs-checkout-action-container">
				<button class="eea-bs-checkout-action-button big ee-roundish ee-button ee-green">Check In</button>
			</section>
			<div style="clear:both">
		</div>
		<div style="clear:both"></div>
	</div>
	<div style="clear:both"></div>
	<div id="eea-bs-view-answers-container" class="eea-barcode-scanner-contact-answer-details-container eea-bs-details-container">
		<h4 class="eea-bs-subtitle-label eea-bs-answers-header">Registration Form Answers:</h4>
		<table class="eea-bs-custom-answers-table">
			<tbody>
				<tr>
					<td>
						<span class="eea-bs-question">What is your T-Shirt size?</span><br>
						<span class="eea-bs-admin-label">Admin Label for question</span>
					</td>
					<td>
						Medium
					</td>
				</tr>
				<tr>
					<td>
						<span class="eea-bs-question">What are your meal selections</span><br>
						<span class="eea-bs-admin-label">Admin Label for question</span>
					</td>
					<td>
						Steak, Potatoes, Fresh Apple Pie
					</td>
				</tr>
			</tbody>
		</table>
	</div>
	<div id="eea-bs-view-group-container" class="eea-barcode-scanner-contact-group-container eea-bs-details-container">
		<h4 class="eea-bs-subtitle-label eea-bs-group-header">Other people in this group:</h4>
		<table class="eea-bs-group-table eea-bs-table widefat">
			<thead>
				<tr>
					<th>First Name</th>
					<th>Last Name</th>
					<th colspan="2">Last Update</th>
				</tr>
			</thead>
			<tbody>
				<tr class="alternate">
					<td>Princess</td>
					<td>Leia</td>
					<td>Jul 10 @ 9:30am<span class="eea-bs-check-icon ee-icon ee-icon-check-out"></span></td>
					<td><button class="eea-bs-checkout-action-button  ee-roundish ee-button ee-green">Check In</button></td>
				</tr>
				<tr>
					<td>Han</td>
					<td>Solo</td>
					<td><span class="eea-bs-check-icon dashicons dashicons-no"></span></td>
					<td><button class="eea-bs-checkout-action-button  ee-roundish ee-button ee-green">Check In</button></td>
				</tr>
				<tr class="alternate">
					<td>Chewbacca</td>
					<td></td>
					<td>July 10 @ 6:00am<span class="eea-bs-check-icon ee-icon ee-icon-check-in"></span></td>
					<td><button class="eea-bs-checkout-action-button  ee-roundish ee-button ee-red">Check Out</button></td>
				</tr>
			</tbody>
		</table>
		<button class="eea-bs-checkout-action-button big ee-roundish ee-button ee-green align-right">Check All Registrants In</button>
		<div style="clear:both"></div>
	</div>
</div>
