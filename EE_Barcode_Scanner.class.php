<?php
/**
 * File contains EE_Barcode_Scanner class (the starter for the engine).
 *
 * @since %VER%
 * @package EE4 Barcode Scanner
 * @subpackage scanning
 */
if ( ! defined( 'EVENT_ESPRESSO_VERSION' )) { exit(); }
/**
 * ------------------------------------------------------------------------
 *
 * Class  EE_Barcode_Scanner
 *
 * @package			EE4 Barcode Scanner
 * @subpackage		scanning
 * @author			Darren Ethier
 * @since %VER%
 *
 * ------------------------------------------------------------------------
 */
// define the plugin directory path and URL
define( 'EE_BARCODE_SCANNER_BASENAME', plugin_basename( EE_BARCODE_SCANNER_PLUGIN_FILE ));
define( 'EE_BARCODE_SCANNER_PATH', plugin_dir_path( __FILE__ ));
define( 'EE_BARCODE_SCANNER_URL', plugin_dir_url( __FILE__ ));
define( 'EE_BARCODE_SCANNER_ADMIN', EE_BARCODE_SCANNER_PATH . 'admin' . DS . 'ee_barcode_scanner' . DS );
Class  EE_Barcode_Scanner extends EE_Addon {

	/**
	 * class constructor
	 */
	public function __construct() {
	}

	public static function register_addon() {
		// register addon via Plugin API
		EE_Register_Addon::register(
			'EE_Barcode_Scanner',
			array(
				'version' => EE_BARCODE_SCANNER_VERSION,
				'min_core_version' => '4.5.0.dev.000',
				'main_file_path' => EE_BARCODE_SCANNER_PLUGIN_FILE,
				'admin_path' => EE_BARCODE_SCANNER_ADMIN,
				'autoloader_paths' => array(
					'EE_Barcode_Scanner' => EE_BARCODE_SCANNER_PATH . 'EE_Barcode_Scanner.class.php',
					'EE_Barcode_Scanner_Admin_Page' => EE_BARCODE_SCANNER_ADMIN . 'EE_Barcode_Scanner_Admin_Page.core.php',
					'EE_Barcode_Scanner_Admin_Page_Init' => EE_BARCODE_SCANNER_ADMIN . 'EE_Barcode_Scanner_Admin_Page_Init.core.php',
				),
				'module_paths' => array( EE_BARCODE_SCANNER_PATH . 'EED_Barcode_Scanner.module.php' ),
				'shortcode_paths' => array( EE_BARCODE_SCANNER_PATH . 'EES_Barcode_Scanner.shortcode.php' ),
				// if plugin update engine is being used for auto-updates. not needed if PUE is not being used.
				'pue_options' => array(
					'pue_plugin_slug' => 'eea_barcode_scanner',
					'checkPeriod' => '24',
					'use_wp_update' => FALSE,
					),
				'capabilities' => array(
					'administrator' => array(
						'ee_manage_scanner'
						),
					)
			)
		);
	}

}
// End of file EE_Barcode_Scanner.class.php
// Location: wp-content/plugins/espresso-ee-barcode-scanner/EE_Barcode_Scanner.class.php
