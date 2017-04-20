<?php

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
        $this->assertEquals(has_action('AHEE__EE_System__load_espresso_addons', 'load_espresso_barcode_scanner'),
            10);
        $this->assertTrue(class_exists('EE_Barcode_Scanner'));
    }
}
