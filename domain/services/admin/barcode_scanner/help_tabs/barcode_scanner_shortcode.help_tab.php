<?php
/**
 * Help Tab for barcode scanning default page.
 */
?>
<p><strong><?php _e('Front-end Ticket Scanning Page', 'event_espresso'); ?></strong></p>
<p>
    <?php
    esc_html_e(
        'Tickets can be scanned from any page of your website by adding this shortcode to any WordPress page:',
        'event_espresso'
    );
    ?><br>
<code>[ESPRESSO_BARCODE_SCANNER]</code>
</p>
<p>
    <?php
    /** phpcs:disable Generic.Files.LineLength.TooLong */
    printf(
        /* Translators: emphasized (bold) html */
        esc_html__(
            'Please make sure the page is %spassword protected%s, or set to private to keep unwanted visitors from attempting to check themselves in to your events. See our note about permissions below.',
            'event_espresso'
        ),
        '<strong>',
        '</strong>'
    );
    /** phpcs:enable */
    ?>
</p>
<p>
    <?php
    /** phpcs:disable Generic.Files.LineLength.TooLong */
    printf(
        /* Translators: emphasis (bold), capability slug, and php class name */
        esc_html__(
            '%1$sNote About Permissions:%2$s If the barcode scanner is loaded via the admin page, then we do a capability check to see if the user has the %3$s capability before allowing any action to be done on the scanner (or to even show the scanner form). When this is used on a front facing page via a shortcode that capability check is completely removed. It can be filtered via the %4$s filter to add a capability check for the front-end if desired, but it defaults to no capability check because that makes it easier for Event Admins to implement by just putting the barcode scanner on a password protected page.',
            'event_espresso'
        ),
        '<strong id="permissions">',
        '</strong>',
        '<code>ee_edit_checkin</code>',
        '<code>EED_Barcode_Scanner__scanner_form__user_can_from_shortcode</code>'
    );
    /** phpcs:enable */
    ?>
</p>
<p>
    <?php
    /** phpcs:disable Generic.Files.LineLength.TooLong */
    printf(
        /* Translators: Link to offsite for more details */
        esc_html__(
            'For more details and examples, please %sview the detailed documentation%s for this feature.',
            'event_espresso'
        ),
        '<a href="https://eventespresso.com/wiki/barcode-scanner-add-on/?ee_ver=ee4&utm_source=ee4_plugin_admin&utm_medium=link&utm_campaign=ee_support_tab&utm_content=barcode_scanner_admin">',
        '</a>'
    );
    /** phpcs:enable */
    ?>
</p>