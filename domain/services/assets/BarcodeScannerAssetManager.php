<?php

namespace EventEspresso\BarcodeScanner\domain\services\assets;

use DomainException;
use EventEspresso\core\domain\DomainInterface;
use EventEspresso\core\domain\services\assets\CoreAssetManager;
use EventEspresso\core\exceptions\InvalidDataTypeException;
use EventEspresso\core\exceptions\InvalidEntityException;
use EventEspresso\core\services\assets\AssetCollection;
use EventEspresso\core\services\assets\AssetManager;
use EventEspresso\core\services\assets\Registry;
use EventEspresso\core\services\collections\DuplicateCollectionIdentifierException;

class BarcodeScannerAssetManager extends AssetManager
{

    const JS_HANDLE_SCANNER_COMPATIBILITY = 'eea-scanner-detection-cps';
    const JS_HANDLE_SCANNER_DETECTION = 'eea-scanner-detection';
    const JS_HANDLE_CHOSEN = 'eea-bs-chosen';
    const JS_HANDLE_SCANNER_DETECTION_CORE = 'eea-scanner-detection-core';
    const CSS_HANDLE_CHOSEN = 'eea-bs-chosen';
    const CSS_HANDLE_SCANNER_DETECTION = 'eea-scanner-detection-css';


    /**
     * Main method called for registering assets.
     *
     * @throws DomainException
     * @throws DuplicateCollectionIdentifierException
     * @throws InvalidDataTypeException
     * @throws InvalidEntityException
     */
    public function addAssets()
    {
        $this->registerJavascript();
        $this->registerStyleSheets();
    }


    /**
     * Register javascript assets
     *
     * @throws DomainException
     * @throws InvalidDataTypeException
     * @throws InvalidEntityException
     * @throws DuplicateCollectionIdentifierException
     */
    private function registerJavascript()
    {
        // scanner library
        $script_min = defined('SCRIPT_DEBUG') && SCRIPT_DEBUG ? '' : 'min.';
        $this->addJavascript(
            self::JS_HANDLE_SCANNER_COMPATIBILITY,
            $this->domain->pluginUrl()
            . 'core/third_party_libraries/scanner_detection/jquery.scannerdetection.compatibility.'
            . $script_min . 'js',
            array(CoreAssetManager::JS_HANDLE_JQUERY),
            true
        )->setVersion($this->domain->version());
        $this->addJavascript(
            self::JS_HANDLE_SCANNER_DETECTION,
            $this->domain->pluginUrl()
            . 'core/third_party_libraries/scanner_detection/jquery.scannerdetection.'
            . $script_min . 'js',
            array(self::JS_HANDLE_SCANNER_COMPATIBILITY),
            true
        )->setVersion($this->domain->version());

        $this->addJavascript(
            self::JS_HANDLE_CHOSEN,
            $this->domain->pluginUrl() . 'core/third_party_libraries/chosen/chosen.jquery.' . $script_min . 'js',
            array(CoreAssetManager::JS_HANDLE_JQUERY),
            true
        )->setVersion($this->domain->version());

        $this->addJavascript(
            self::JS_HANDLE_SCANNER_DETECTION_CORE,
            $this->domain->pluginUrl() . 'scripts/espresso_ee_barcode_scanner.js',
            array(self::JS_HANDLE_SCANNER_DETECTION, self::JS_HANDLE_CHOSEN, CoreAssetManager::JS_HANDLE_EE_CORE),
            true
        )->setVersion($this->domain->version());

    }


    /**
     * Register CSS assets.
     *
     * @throws DomainException
     * @throws DuplicateCollectionIdentifierException
     * @throws InvalidDataTypeException
     * @throws InvalidEntityException
     */
    private function registerStyleSheets()
    {
        $script_min = defined('SCRIPT_DEBUG') && SCRIPT_DEBUG ? '' : 'min.';
        $scanner_css_dep = is_admin() ? 'ee-admin-css' : CoreAssetManager::CSS_HANDLE_EE_DEFAULT;
        $this->addStylesheet(
            self::CSS_HANDLE_CHOSEN,
            $this->domain->pluginUrl() . 'core/third_party_libraries/chosen/chosen.' . $script_min . 'css'
        )->setVersion($this->domain->version());

        $this->addStylesheet(
            self::CSS_HANDLE_SCANNER_DETECTION,
            $this->domain->pluginUrl() . 'css/espresso_ee_barcode_scanner.css',
            array($scanner_css_dep, self::CSS_HANDLE_CHOSEN)
        )->setVersion($this->domain->version());
    }
}