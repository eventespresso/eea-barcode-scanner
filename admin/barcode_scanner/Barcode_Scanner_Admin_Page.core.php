<?php
/**
 * Contains Admin page class for barcode scanner admin page
 *
 * @since 1.0.0
 * @package EE4 Barcode Scanner
 * @subpackage admin
 */
if ( ! defined( 'EVENT_ESPRESSO_VERSION' ) ) exit( 'No direct script access allowed' );

/**
 * Admin Page class for EE4 Barcode Scanner
 *
 * @since 1.0.0
 * @see    EE_Admin_Page for all phpdocs related to core methods here that are not documented.
 * @package EE4 Barcode Scanner
 * @subpackage admin
 * @author Darren Ethier
 */
class Barcode_Scanner_Admin_Page extends EE_Admin_Page {

	protected function _init_page_props() {
		$this->page_slug = EE_BARCODE_SCANNER_PG_SLUG;
		$this->_admin_base_url = EE_BARCODE_SCANNER_ADMIN_URL;
		$this->_admin_base_path = EE_BARCODE_SCANNER_ADMIN;
		$this->page_label = EE_BARCODE_SCANNER_PG_NAME;
	}


	protected function _define_page_props() {
		$this->_admin_page_title = $this->page_label;
		$this->_labels = array();
	}


	protected function _set_page_routes() {
		$this->_page_routes = array(
			'default' => array(
				'func' => '_barcode_scanner',
				'capability' => 'ee_read_checkins'
				)
			);
	}



	protected function _set_page_config() {
		$this->_page_config = array(
			'default' => array(
				'nav' => array(
					'label' => __('Barcode Scanning', 'event_espresso' ),
					'order' => 5
					),
				'help_tabs' => array(
					'barcode_scanning_overview_help_tab' => array(
						'title' => __('Overview', 'event_espresso'),
						'filename' => 'barcode_scanner_overview'
						),
					'barcode_scanning_shortcode_help_tab' => array(
						'title' => __('Front-end Ticket Scanning', 'event_espresso'),
						'filename' => 'barcode_scanner_shortcode'
						)
					)
				)
			);
	}



	//below in the next group are things that aren't used but have to be defined.
	protected function _ajax_hooks() {}
	protected function _add_screen_options() {}
	protected function _add_feature_pointers() {}
	public function admin_init() {}
	public function admin_notices() {}
	public function admin_footer_scripts() {}
	public function load_scripts_styles() {}



	public function load_scripts_styles_default() {
		EED_Barcode_Scanner::instance()->enqueue_scripts();
	}



	/**
	 * Handles outputting the scanning form.
	 * Note that this grabs the form and all related files etc from the EED_Barcode_Scanner module.
	 *
	 * @since 1.0.0
	 *
	 * @return string html output.
	 */
	protected function _barcode_scanner() {
		$this->_template_args['admin_page_content'] = EED_Barcode_Scanner::instance()->scanner_form( false );
		$this->display_admin_page_with_no_sidebar();
	}


} //end EE_Barcode_Scanner_Admin_Page
