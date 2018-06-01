<?php
/*
  Plugin Name: Event Espresso - Barcode Scanner (EE 4.9.46+)
  Plugin URI: http://www.eventespresso.com
  Description: Add a barcode scanner for checking in or checkout out attendees.  Requires Event Espresso 4 Core.
               This will work with any barcode that contains the special encoded registration_url_link or the form can
               be used for manual entry without a scanner.
  Version: 1.0.12.rc.011

  Author: Event Espresso
  Author URI: http://www.eventespresso.com
  Copyright 2014 Event Espresso (email : support@eventespresso.com)

  This program is free software; you can redistribute it and/or modify
  it under the terms of the GNU General Public License, version 2, as
  published by the Free Software Foundation.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program; if not, write to the Free Software
  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA02110-1301USA
 *
 * ------------------------------------------------------------------------
 *
 * Event Espresso
 *
 * Event Registration and Management Plugin for WordPress
 *
 * @ package		EE4 Barcode Scanner
 * @ author			Event Espresso
 * @ copyright	    (c) 2008-2014 Event Espresso  All Rights Reserved.
 * @ license		http://eventespresso.com/support/terms-conditions/   * see Plugin Licensing *
 * @ link			http://www.eventespresso.com
 * @ version	 	1.0.0
 *
 * ------------------------------------------------------------------------
 */
define('EE_BARCODE_SCANNER_VERSION', '1.0.12.rc.011');

// check php version, if not sufficient then deactivate and show notice
// requires PHP 5.6 ++
if (! defined('PHP_VERSION_ID')
    || PHP_VERSION_ID < 50600
) {
    add_action('admin_notices', 'eea_barcode_scanner_deactvation_and_notice');
} else {
    require_once __DIR__ . '/bootstrap.php';
}


function eea_barcode_scanner_deactvation_and_notice()
{
    unset($_GET['activate'], $_REQUEST['activate']);
    if (! function_exists('deactivate_plugins')) {
        require_once ABSPATH . 'wp-admin/includes/plugin.php';
    }
    deactivate_plugins(plugin_basename(__FILE__));
    /** phpcs:disable Generic.Files.LineLength.TooLong */
    ?>
    <div class="error">
        <p>
            <?php printf(
                /* translators: php version number */
                esc_html__(
                    'Event Espresso Barcode Scanner add-on could not be activated because it requires PHP version %s or greater.',
                    'event_espresso'
                ),
                '5.6.0'
            ); ?>
        </p>
    </div>
    <?php
    /** phpcs:enable */
}
