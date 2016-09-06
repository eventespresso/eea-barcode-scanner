<?php if ( ! defined( 'EVENT_ESPRESSO_VERSION' )) { exit(); }
/*
 *
 * EES_Barcode_Scanner
 *
 * @package			Event Espresso
 * @subpackage		espresso-ee-barcode-scanner
 * @author 			Darren Ethier
 * @ version		$VID:$
 */
class EES_Espresso_Barcode_Scanner  extends EES_Shortcode {



	/**
	 * 	set_hooks - for hooking into EE Core, modules, etc
	 *
	 *  @access 	public
	 *  @return 	void
	 */
	public static function set_hooks() {
	}



	/**
	 * 	set_hooks_admin - for hooking into EE Admin Core, modules, etc
	 *
	 *  @access 	public
	 *  @return 	void
	 */
	public static function set_hooks_admin() {
	}



	/**
	 * 	set_definitions
	 *
	 *  @access 	public
	 *  @return 	void
	 */
	public static function set_definitions() {
	}



	/**
	 * 	run - initial shortcode module setup called during "wp_loaded" hook
	 * 	this method is primarily used for loading resources that will be required by the shortcode when it is actually processed
	 *
	 *  @access 	public
	 *  @param 	 WP $WP
	 *  @return 	void
	 */
	public function run( WP $WP ) {
		// this will trigger the EED_Barcode_Scanner module's run() method during the pre_get_posts hook point,
		// this allows us to initialize things, enqueue assets, etc,
		// as well, this saves an instantiation of the module in an array, using 'ee_barcode_scanner' as the key, so that we can retrieve it
		EED_Barcode_Scanner::instance()->run( $WP );
		EED_Barcode_Scanner::$shortcode_active = TRUE;
	}



	/**
	 *    process_shortcode
	 *
	 *    [ESPRESSO_EE_BARCODE_SCANNER]
	 *
	 * @access 	public
	 * @param 	array $attributes
	 * @return 	void
	 */
	public function process_shortcode( $attributes = array() ) {
		EED_Barcode_Scanner::instance()->scanner_form();
	}


}
// End of file EES_Espresso_Barcode_Scanner.shortcode.php
// Location: /wp-content/plugins/espresso-ee-barcode-scanner/EES_Espresso_Barcode_Scanner.shortcode.php
