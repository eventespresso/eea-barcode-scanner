<?php
/*
  Plugin Name: Event Espresso - Barcode Scanner (EE 4.6.0+)
  Plugin URI: http://www.eventespresso.com
  Description: Add a barcode scanner for checking in or checkout out attendees.  Requires Event Espresso 4 Core.  This will work with any barcode that contains the special encoded registration_url_link or the form can be used for manual entry without a scanner.
  Version: 1.0.11.p

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
define( 'EE_BARCODE_SCANNER_VERSION', '1.0.11.p' );
define( 'EE_BARCODE_SCANNER_PLUGIN_FILE',  __FILE__ );
function load_espresso_barcode_scanner() {
if ( class_exists( 'EE_Addon' )) {
	// ee_barcode_scanner version
	require_once ( plugin_dir_path( __FILE__ ) . 'EE_Barcode_Scanner.class.php' );
	EE_Barcode_Scanner::register_addon();
}
}
add_action( 'AHEE__EE_System__load_espresso_addons', 'load_espresso_barcode_scanner' );

// End of file espresso_barcode_scanner.php
// Location: wp-content/plugins/eea-barcode-scanner/espresso_barcode_scanner.php
