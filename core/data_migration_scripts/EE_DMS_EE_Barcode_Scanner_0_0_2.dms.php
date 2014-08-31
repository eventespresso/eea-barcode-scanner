<?php

if (!defined('EVENT_ESPRESSO_VERSION'))
	exit('No direct script access allowed');

/**
 *
 * EE_DMS_EE_Barcode_Scanner_0_0_1
 *
 * @package			Event Espresso
 * @subpackage
 * @author				Mike Nelson
 *
 */
class EE_DMS_EE_Barcode_Scanner_0_0_2 extends EE_Data_Migration_Script_Base{

	public function __construct() {
		$this->_pretty_name = __("Data Migration to EE Barcode Scanner 0.0.2", "event_espresso");
		$this->_migration_stages = array(
			/*
			 * add children of EE_Data_Migration_Script_Stage or EE_Data_Migration_Script_Stage_Table
			 * it's easiest to add these classes onto this same file, or use EEH_Autoloader to autoload them
			 * BEFORE declaring this class' name (because on some requests only THIS file is auto-loaded
			 * and the class is unserialized from the DB- ie used but NOT constructed)
			 */
		);
		parent::__construct();
	}
	/**
	 * only run when EE Barcode Scanner is at exactly version 0.0.1
	 * @param type $version_string
	 * @return boolean
	 */
	public function can_migrate_from_version($version_string) {
		if(isset($version_string['EE_Barcode_Scanner'])){
			if(version_compare('0.0.2', $version_string['EE_Barcode_Scanner'])){
				//db state is old. this applies
				return true;
			}else{
				//db state is at 0.0.2 or higher. this doesnt apply
				return false;

			}
		}else{
			//apparently this addon was never installed prevously
			//so we don't want ot migrate (we'll probably just add the tables
			//upon activation of the addon, instead of putting the site in maintenance
			//mode and running migrations
			return false;
		}
	}

	public function schema_changes_after_migration() {

	}

	public function schema_changes_before_migration() {
		$this->_table_is_new_in_this_version('esp_ee_barcode_scanner_thing', '
			NEW_ID int(10) unsigned NOT NULL AUTO_INCREMENT,
			NEW_name VARCHAR(10) NOT NULL,
			PRIMARY KEY  (NEW_ID)'
				);
		$this->_table_is_new_in_this_version('esp_ee_barcode_scanner_attendee_meta', '
			NATT_ID int(10) unsigned NOT NULL AUTO_INCREMENT,
			ATT_ID int(10) unsigned NOT NULL,
			ATT_foobar int(10) unsigned NOT NULL,
			PRIMARY KEY  (NATT_ID)'
				);
	}
}

// End of file EE_DMS_EE_Barcode_Scanner_0_0_1.dms.php