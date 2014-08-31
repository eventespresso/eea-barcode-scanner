<?php if ( ! defined('EVENT_ESPRESSO_VERSION')) exit('No direct script access allowed');
/**
* Event Espresso
*
* Event Registration and Management Plugin for WordPress
*
* @ package 		Event Espresso
* @ author			Seth Shoultes
* @ copyright 	(c) 2008-2011 Event Espresso  All Rights Reserved.
* @ license 		{@link http://eventespresso.com/support/terms-conditions/}   * see Plugin Licensing *
* @ link 				{@link http://www.eventespresso.com}
* @ since		 	$VID:$
*
* ------------------------------------------------------------------------
*
* EE_Barcode_Scanner_Admin_Page_Init class
*
* This is the init for the EE_Barcode_Scanner Addon Admin Pages.  See EE_Admin_Page_Init for method inline docs.
*
* @package			Event Espresso (ee_barcode_scanner addon)
* @subpackage		admin/EE_Barcode_Scanner_Admin_Page_Init.core.php
* @author				Darren Ethier
*
* ------------------------------------------------------------------------
*/
class EE_Barcode_Scanner_Admin_Page_Init extends EE_Admin_Page_Init  {

	/**
	 * 	constructor
	 *
	 * @access public
	 * @return \EE_Barcode_Scanner_Admin_Page_Init
	 */
	public function __construct() {

		do_action( 'AHEE_log', __FILE__, __FUNCTION__, '' );

		define( 'EE_BARCODE_SCANNER_PG_SLUG', 'espresso_ee_barcode_scanner' );
		define( 'EE_BARCODE_SCANNER_LABEL', __( 'EE_Barcode_Scanner', 'event_espresso' ));
		define( 'EE_EE_BARCODE_SCANNER_ADMIN_URL', admin_url( 'admin.php?page=' . EE_BARCODE_SCANNER_PG_SLUG ));
		define( 'EE_EE_BARCODE_SCANNER_ADMIN_ASSETS_PATH', EE_EE_BARCODE_SCANNER_ADMIN . 'assets' . DS );
		define( 'EE_EE_BARCODE_SCANNER_ADMIN_ASSETS_URL', EE_EE_BARCODE_SCANNER_URL . 'admin' . DS . 'ee_barcode_scanner' . DS . 'assets' . DS );
		define( 'EE_EE_BARCODE_SCANNER_ADMIN_TEMPLATE_PATH', EE_EE_BARCODE_SCANNER_ADMIN . 'templates' . DS );
		define( 'EE_EE_BARCODE_SCANNER_ADMIN_TEMPLATE_URL', EE_EE_BARCODE_SCANNER_URL . 'admin' . DS . 'ee_barcode_scanner' . DS . 'templates' . DS );

		parent::__construct();
		$this->_folder_path = EE_EE_BARCODE_SCANNER_ADMIN;

	}





	protected function _set_init_properties() {
		$this->label = EE_BARCODE_SCANNER_LABEL;
	}



	/**
	*		_set_menu_map
	*
	*		@access 		protected
	*		@return 		void
	*/
	protected function _set_menu_map() {
		$this->_menu_map = new EE_Admin_Page_Sub_Menu( array(
			'menu_group' => 'addons',
			'menu_order' => 25,
			'show_on_menu' => EE_Admin_Page_Menu_Map::BLOG_ADMIN_ONLY,
			'parent_slug' => 'espresso_events',
			'menu_slug' => EE_BARCODE_SCANNER_PG_SLUG,
			'menu_label' => EE_BARCODE_SCANNER_LABEL,
			'capability' => 'administrator',
			'admin_init_page' => $this
		));
	}



}
// End of file EE_Barcode_Scanner_Admin_Page_Init.core.php
// Location: /wp-content/plugins/espresso-ee-barcode-scanner/admin/ee_barcode_scanner/EE_Barcode_Scanner_Admin_Page_Init.core.php
