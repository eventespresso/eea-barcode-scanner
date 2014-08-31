<?php if ( ! defined( 'EVENT_ESPRESSO_VERSION' )) { exit(); }
/**
 * ------------------------------------------------------------------------
 *
 * Class  EE_EE_Barcode_Scanner
 *
 * @package			Event Espresso
 * @subpackage		espresso-ee-barcode-scanner
 * @author			    Brent Christensen
 * @ version		 	$VID:$
 *
 * ------------------------------------------------------------------------
 */
// define the plugin directory path and URL
define( 'EE_EE_BARCODE_SCANNER_BASENAME', plugin_basename( EE_EE_BARCODE_SCANNER_PLUGIN_FILE ));
define( 'EE_EE_BARCODE_SCANNER_PATH', plugin_dir_path( __FILE__ ));
define( 'EE_EE_BARCODE_SCANNER_URL', plugin_dir_url( __FILE__ ));
define( 'EE_EE_BARCODE_SCANNER_ADMIN', EE_EE_BARCODE_SCANNER_PATH . 'admin' . DS . 'ee_barcode_scanner' . DS );
Class  EE_EE_Barcode_Scanner extends EE_Addon {

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
				'version' 					=> EE_EE_BARCODE_SCANNER_VERSION,
				'min_core_version' => '4.3.0',
				'main_file_path' 				=> EE_EE_BARCODE_SCANNER_PLUGIN_FILE,
				'admin_path' 			=> EE_EE_BARCODE_SCANNER_ADMIN,
				'admin_callback'		=> 'additional_admin_hooks',
				'config_class' 			=> 'EE_EE_Barcode_Scanner_Config',
				'config_name' 		=> 'EE_EE_Barcode_Scanner',
				'autoloader_paths' => array(
					'EE_EE_Barcode_Scanner' 						=> EE_EE_BARCODE_SCANNER_PATH . 'EE_EE_Barcode_Scanner.class.php',
					'EE_EE_Barcode_Scanner_Config' 			=> EE_EE_BARCODE_SCANNER_PATH . 'EE_EE_Barcode_Scanner_Config.php',
					'EE_Barcode_Scanner_Admin_Page' 		=> EE_EE_BARCODE_SCANNER_ADMIN . 'EE_Barcode_Scanner_Admin_Page.core.php',
					'EE_Barcode_Scanner_Admin_Page_Init' => EE_EE_BARCODE_SCANNER_ADMIN . 'EE_Barcode_Scanner_Admin_Page_Init.core.php',
				),
//				'dms_paths' 			=> array( EE_EE_BARCODE_SCANNER_PATH . 'core' . DS . 'data_migration_scripts' . DS ),
				'module_paths' 		=> array( EE_EE_BARCODE_SCANNER_PATH . 'EED_EE_Barcode_Scanner.module.php' ),
				'shortcode_paths' 	=> array( EE_EE_BARCODE_SCANNER_PATH . 'EES_EE_Barcode_Scanner.shortcode.php' ),
				'widget_paths' 		=> array( EE_EE_BARCODE_SCANNER_PATH . 'EEW_EE_Barcode_Scanner.widget.php' ),
				// if plugin update engine is being used for auto-updates. not needed if PUE is not being used.
				'pue_options'			=> array(
					'pue_plugin_slug' => 'espresso_ee_barcode_scanner',
					'checkPeriod' => '24',
					'use_wp_update' => FALSE,
					),
				'capabilities' => array(
					'administrator' => array(
						'read_addon', 'edit_addon', 'edit_others_addon', 'edit_private_addon'
						),
					),
				'capability_maps' => array(
					new EE_Meta_Capability_Map_Edit( 'edit_addon', array( 'Event', '', 'edit_others_addon', 'edit_private_addon' ) )
					),
				'class_paths' => EE_EE_BARCODE_SCANNER_PATH . 'core' . DS . 'db_classes',
				'model_paths' => EE_EE_BARCODE_SCANNER_PATH . 'core' . DS . 'db_models',
				'class_extension_paths' => EE_EE_BARCODE_SCANNER_PATH . 'core' . DS . 'db_class_extensions',
				'model_extension_paths' => EE_EE_BARCODE_SCANNER_PATH . 'core' . DS . 'db_model_extensions'
			)
		);
	}



	/**
	 * 	additional_admin_hooks
	 *
	 *  @access 	public
	 *  @return 	void
	 */
	public function additional_admin_hooks() {
		// is admin and not in M-Mode ?
		if ( is_admin() && ! EE_Maintenance_Mode::instance()->level() ) {
			add_filter( 'plugin_action_links', array( $this, 'plugin_actions' ), 10, 2 );
		}
	}



	/**
	 * plugin_actions
	 *
	 * Add a settings link to the Plugins page, so people can go straight from the plugin page to the settings page.
	 * @param $links
	 * @param $file
	 * @return array
	 */
	public function plugin_actions( $links, $file ) {
		if ( $file == EE_EE_BARCODE_SCANNER_BASENAME ) {
			// before other links
			array_unshift( $links, '<a href="admin.php?page=espresso_ee_barcode_scanner">' . __('Settings') . '</a>' );
		}
		return $links;
	}






}
// End of file EE_EE_Barcode_Scanner.class.php
// Location: wp-content/plugins/espresso-ee-barcode-scanner/EE_EE_Barcode_Scanner.class.php
