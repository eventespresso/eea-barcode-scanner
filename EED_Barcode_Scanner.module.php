<?php
/**
 * Contains main module for Barcode Scanner
 *
 * @since 1.0.0
 * @package EE4 Barcode Scanner
 * @subpackage module
 */
if ( ! defined( 'EVENT_ESPRESSO_VERSION' ) ) exit( 'No direct script access allowed' );

/**
 * The main module class for the EE Barcode Scanner app.
 *
 * @since %VER%
 * @package EE4 Barcode Scanner
 * @subpackage module
 * @author Darren Ethier
 */
class EED_Barcode_Scanner extends EED_Module {

	/**
	 * @var 		bool
	 * @access 	public
	 */
	public static $shortcode_active = FALSE;



	/**
	 * @return EED_Barcode_Scanner
	 */
	public static function instance() {
		return parent::get_instance( __CLASS__ );
	}



	 /**
	  * 	set_hooks - for hooking into EE Core, other modules, etc
	  *
	  *  @access 	public
	  *  @return 	void
	  */
	 public static function set_hooks() {
	 	 // ajax hooks
		 add_action( 'wp_ajax_ee_barcode_scanner_main_action', array( 'EED_Barcode_Scanner', '_ee_barcode_scanner_main_action' ) );
		 add_action( 'wp_ajax_nopriv_ee_barcode_scanner_main_action', array( 'EED_Barcode_Scanner', '_ee_barcode_scanner_main_action' ) );
	 }




	 /**
	  * 	set_hooks_admin - for hooking into EE Admin Core, other modules, etc
	  *
	  *  @access 	public
	  *  @return 	void
	  */
	 public static function set_hooks_admin() {
		 // ajax hooks
		 add_action( 'wp_ajax_ee_barcode_scanner_main_action', array( 'EED_Barcode_Scanner', '_ee_barcode_scanner_main_action' ) );
	 }




	/**
	 *    config
	 *
	 * @return EE_Barcode_Scanner_Config
	 */
	public function config(){
		// config settings are setup up individually for EED_Modules via the EE_Configurable class that all modules inherit from, so
		// $this->config();  can be used anywhere to retrieve it's config, and:
		// $this->_update_config( $EE_Config_Base_object ); can be used to supply an updated instance of it's config object
		// to piggy back off of the config setup for the base EE_Barcode_Scanner class, just use the following (note: updates would have to occur from within that class)
		// currently unused.
		//return EE_Registry::instance()->addons->EE_Barcode_Scanner->config();
	}






	 /**
	  *    run - initial module setup
	  *
	  * @access    public
	  * @param  WP $WP
	  * @return    void
	  */
	 public function run( $WP ) {
		 add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ));
	 }






	/**
	 * 	enqueue_scripts - Load the scripts and css
	 *
	 *  @access 	public
	 *  @return 	void
	 */
	public function enqueue_scripts() {
		//scanner library
		$script_min = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : 'min.';
		wp_register_script( 'eea-scanner-detection-cps', EE_BARCODE_SCANNER_URL . 'core/third_party_libraries/scanner_detection/jquery.scannerdetection.compatibility.' . $script_min . 'js', array( 'jquery' ), EE_BARCODE_SCANNER_VERSION, true );
		wp_register_script( 'eea-scanner-detection', EE_BARCODE_SCANNER_URL . 'core/third_party_libraries/scanner_detection/jquery.scannerdetection.' . $script_min . 'js', array( 'eea-scanner-detection-cps' ), EE_BARCODE_SCANNER_VERSION, true );

		//addon js/css
		wp_register_style( 'espresso_default', EE_GLOBAL_ASSETS_URL . 'css/espresso_default.css', array( 'dashicons' ), EVENT_ESPRESSO_VERSION );
		wp_register_style( 'eea-scanner-detection-css', EE_BARCODE_SCANNER_URL . 'css/espresso_ee_barcode_scanner.css', array('espresso_default'), EE_BARCODE_SCANNER_VERSION );
		wp_register_script( 'eea-scanner-detection-core', EE_BARCODE_SCANNER_URL . 'scripts/espresso_ee_barcode_scanner.js', array( 'eea-scanner-detection' ), EE_BARCODE_SCANNER_VERSION, true );

		// is the shortcode or widget in play || is_admin?
		if ( EED_Barcode_Scanner::$shortcode_active || is_admin() ) {
			wp_enqueue_style( 'eea-scanner-detection-css' );
			wp_enqueue_script( 'ee-scanner-detection-core' );
		}
	}




	/**
	 * This outputs the initial scanner form for receiving scanning info.
	 *
	 * @since %VER%
	 *
	 * @param bool $echo if true (default), then echo the form.  Otherwise it just gets returned.
	 *
	 * @return string
	 */
	public function scanner_form( $echo = true ) {

		//user permission check first
		if ( ! $this->_user_check() ) {
			EE_Error::add_error( __('Sorry, but you do not have permissions to access the barcode scanner form.  Please see the site administrator about gaining access', 'event_espresso' ), __FILE__, __FUNCTION__, __LINE__ );
			return '';
		}

		//selector for the different default actions after a scan.
		EE_Registry::instance()->load_helper('Form_Fields');
		EE_Registry::instance()->load_helper('Template');
		$action_options = array(
			0 => array(
				'text' => __('Lookup Attendee', 'event_espresso'),
				'id' => 'confirm'
				),
			1 => array(
				'text' => __('Continuous Scanning', 'event_espresso' ),
				'id' => 'auto'
				)
			);

		$template_args = array(
			'_wpnonce' => wp_create_nonce( 'ee_banner_scan_form' ),
			'action_selector' => EEH_Form_Fields::select_input( 'scanner_form_default_action', $action_options, 'confirm', '', 'eea-banner-scanner-action-select' ),
			'button_class' => is_admin() ? 'button button-primary' : 'ee-roundish ee-green ee-button'
			);
		$template = EE_BARCODE_SCANNER_ADMIN . 'templates/scanner_detection_form.template.php';

		if ( $echo ) {
			EEH_Template::display_template( $template, $template_args );
		} else {
			return EEH_Template::display_template( $template, $template_args, TRUE );
		}
	}




	/**
	 * Helper method for checking user permissions on running a scan.
	 * Note by default, all wp-admin implementations of the scanning form (and related actions) are only permissible to users with the ee_edit_checkin capability.  However, when the shortcode is used to output the form it allows for ANY user to do the scans.  This is filterable however.  The reason for this is because it is possible that users want to allow self-checkin.  It IS possible for admins to still control the integrity of frontend scanning by using the shortcode on a password protected post.
	 *
	 * @since %VER%
	 *
	 *
	 * @return bool  yes if user can, no if user can't.
	 */
	private function _user_check() {
		return is_admin() ? EE_Capabilities::instance()->current_user_can( 'ee_edit_checkin', 'do_barcode_scan' ) : apply_filters( 'EED_Barcode_Scanner__scanner_form__user_can_from_shortcode', true );
	}




	/**
	 *		@ override magic methods
	 *		@ return void
	 */
	public function __set($a,$b) { return FALSE; }
	public function __get($a) { return FALSE; }
	public function __isset($a) { return FALSE; }
	public function __unset($a) { return FALSE; }
	public function __clone() { return FALSE; }
	public function __wakeup() { return FALSE; }
	public function __destruct() { return FALSE; }

 }
// End of file EED_Barcode_Scanner.module.php
// Location: /wp-content/plugins/eea-barcode-scanner/EED_Barcode_Scanner.module.php
