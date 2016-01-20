<?php
/**
 * Help Tab for barcode scanning default page.
 */
?>
<p><strong>Front-end Ticket Scanning Page</strong></p>
<p>Tickets can be scanned from any page of your website by adding this shortcode to any WordPress page:<br>
<code>[ESPRESSO_BARCODE_SCANNER]</code>
</p>
<p>Please make sure the page is <strong>password protected</strong>, or set to private  to keep unwanted visitors from attempting to check themselves in to your events. See our note about permissions below.</p>
<p><strong id="permissions">Note About Permissions:</strong> If the barcode scanner is loaded via the admin page, then we do a capability check to see if the user has the <code>ee_edit_checkin</code> capability before allowing any action to be done on the scanner (or to even show the scanner form). When this is used on a front facing page via a shortcode that capability check is completely removed. It can be filtered via the <code>EED_Barcode_Scanner__scanner_form__user_can_from_shortcode</code> filter to add a capability check for the front-end if desired, but it defaults to no capability check because that makes it easier for Event Admin’s to implement by just putting the barcode scanner on a password protected page.</p>
<p>For more details and examples, please <a href="https://eventespresso.com/wiki/barcode-scanner-add-on/">view the detailed documentation</a> for this feature</p>