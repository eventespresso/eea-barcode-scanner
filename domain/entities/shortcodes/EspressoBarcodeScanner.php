<?php
namespace EventEspresso\BarcodeScanner\domain\entities\shortcodes;

use DomainException;
use EE_Error;
use EED_Barcode_Scanner;
use EventEspresso\core\exceptions\EntityNotFoundException;
use EventEspresso\core\exceptions\InvalidDataTypeException;
use EventEspresso\core\exceptions\InvalidInterfaceException;
use EventEspresso\core\services\shortcodes\EspressoShortcode;
use Exception;
use InvalidArgumentException;
use ReflectionException;

/**
 * EspressoBarcodeScanner
 *
 * @package EventEspresso\BarcodeScanner\domain\entities\shortcodes
 * @author  Darren Ethier
 * @since   $VID:$
 */
class EspressoBarcodeScanner extends EspressoShortcode
{

    const SHORTCODE_TAG = 'ESPRESSO_BARCODE_SCANNER';


    /**
     * the actual shortcode tag that gets registered with WordPress
     *
     * @return string
     */
    public function getTag()
    {
        return self::SHORTCODE_TAG;
    }


    /**
     * the length of time in seconds to cache the results of the processShortcode() method
     * 0 means the processShortcode() results will NOT be cached at all
     *
     * @return int
     */
    public function cacheExpiration()
    {
        return 0;
    }


    /**
     * a place for adding any initialization code that needs to run prior to wp_header().
     * this may be required for shortcodes that utilize a corresponding module,
     * and need to enqueue assets for that module
     *
     * !!! IMPORTANT !!!
     * After performing any logic within this method required for initialization
     *         $this->shortcodeHasBeenInitialized();
     * should be called to ensure that the shortcode is setup correctly.
     *
     * @return void
     * @throws Exception
     */
    public function initializeShortcode()
    {
        EED_Barcode_Scanner::$shortcode_active = true;
        EED_Barcode_Scanner::instance()->run(null);
    }


    /**
     * callback that runs when the shortcode is encountered in post content.
     * IMPORTANT !!!
     * remember that shortcode content should be RETURNED and NOT echoed out
     *
     * @param array $attributes
     * @return string
     * @throws DomainException
     * @throws EE_Error
     * @throws EntityNotFoundException
     * @throws InvalidDataTypeException
     * @throws InvalidInterfaceException
     * @throws InvalidArgumentException
     * @throws ReflectionException
     */
    public function processShortcode($attributes = array())
    {
        return EED_Barcode_Scanner::instance()->scanner_form(false);
    }
}
