<?php
/**
 * Contains Admin init class for barcode scanner admin page
 *
 * @since 1.0.0
 * @package EE4 Barcode Scanner
 * @subpackage admin
 */
if ( ! defined( 'EVENT_ESPRESSO_VERSION' ) ) exit( 'No direct script access allowed' );

/**
 * Admin init class for EE4 Barcode Scanner
 *
 * @since 1.0.0
 * @see    EE_Admin_Page_Init for all phpdocs related to core methods here that are not documented.
 * @package EE4 Barcode Scanner
 * @subpackage admin
 * @author Darren Ethier
 */
class Barcode_Scanner_Admin_Page_Init extends EE_Admin_Page_Init {

	public function __construct() {
		do_action( 'AHEE_log', __FILE__, __FUNCTION__ );

		define( 'EE_BARCODE_SCANNER_PG_SLUG', 'eea_barcode_scanner' );
		define( 'EE_BARCODE_SCANNER_PG_NAME', __('Barcode Scanner', 'event_espresso' ) );
		define( 'EE_BARCODE_SCANNER_ADMIN_URL', admin_url( 'admin.php?page=' . EE_BARCODE_SCANNER_PG_SLUG ) );
		define( 'EE_BARCODE_SCANNER_ASSETS_PATH', EE_BARCODE_SCANNER_ADMIN . 'assets/' );
		define( 'EE_BARCODE_SCANNER_ASSETS_URL', EE_BARCODE_SCANNER_ADMIN_URL . 'assets/' );
		define( 'EE_BARCODE_SCANNER_TEMPLATE_PATH', EE_BARCODE_SCANNER_ADMIN . 'templates/' );
		define( 'EE_BARCODE_SCANNER_TEMPLATE_URL', EE_BARCODE_SCANNER_ADMIN_URL . 'templates/' );

		parent::__construct();
		$this->_folder_path = EE_BARCODE_SCANNER_ADMIN;
	}


	protected function _set_init_properties() {
		$this->label = __( 'Barcode Scanning', 'event_espresso' );
	}


	protected function _set_menu_map() {
		$this->_menu_map = new EE_Admin_Page_Sub_Menu( array(
			'menu_group' => 'addons',
			'menu_order' => '20',
			'show_on_menu' => EE_Admin_Page_Menu_Map::BLOG_ADMIN_ONLY,
			'parent_slug' => 'espresso_events',
			'menu_slug' => EE_BARCODE_SCANNER_PG_SLUG,
			'menu_label' => EE_BARCODE_SCANNER_PG_NAME,
			'capability' => 'ee_read_checkins',
			'admin_init_page' => $this
			) );
	}
}
