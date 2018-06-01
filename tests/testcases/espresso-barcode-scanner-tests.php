<?php

use EventEspresso\BarcodeScanner\domain\BarcodeScanner;

/**
 * Test class for espresso-barcode-scanner main file
 *
 * @since         0.0.1.dev.002
 * @package       EventEspresso\BarcodeScanner
 * @subpackage    tests
 */
class eea_barcode_scanner_tests extends EE_UnitTestCase
{

    /**
     * Tests the loading of the main file
     */
    function test_loading_ee_barcode_scanner()
    {
        $this->assertTrue(class_exists(BarcodeScanner::class));
        $this->assertInstanceOf(
            BarcodeScanner::class,
            EE_Registry::instance()->addons->EventEspresso_BarcodeScanner_domain_BarcodeScanner
        );
    }
}
