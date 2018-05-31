<?php

namespace EventEspresso\BarcodeScanner\domain;

use DomainException;
use EE_Addon;
use EE_Dependency_Map;
use EE_Error;
use EE_Register_Addon;
use EventEspresso\BarcodeScanner\domain\entities\shortcodes\EspressoBarcodeScanner;
use EventEspresso\BarcodeScanner\domain\services\assets\BarcodeScannerAssetManager;
use EventEspresso\core\domain\DomainInterface;
use EventEspresso\core\exceptions\InvalidDataTypeException;
use EventEspresso\core\exceptions\InvalidInterfaceException;
use EventEspresso\core\services\assets\AssetCollection;
use EventEspresso\core\services\assets\Registry;
use EventEspresso\core\services\loaders\LoaderInterface;
use InvalidArgumentException;
use ReflectionException;

/**
 * BarcodeScanner
 *
 *
 * @package EventEspresso\BarcodeScanner\domain
 * @author  Darren Ethier
 * @since   $VID:$
 */
class BarcodeScanner extends EE_Addon
{

    /**
     * @var LoaderInterface
     */
    private $loader;


    /**
     * BarcodeScanner constructor.
     *
     * @param EE_Dependency_Map $dependency_map
     * @param DomainInterface   $domain
     * @param LoaderInterface   $loader
     */
    public function __construct(
        EE_Dependency_Map $dependency_map,
        DomainInterface $domain,
        LoaderInterface $loader
    ) {
        $this->loader = $loader;
        parent::__construct($dependency_map, $domain);
    }


    /**
     * @param Domain $domain
     * @throws DomainException
     * @throws EE_Error
     * @throws InvalidDataTypeException
     * @throws InvalidInterfaceException
     * @throws InvalidArgumentException
     * @throws ReflectionException
     */
    public static function registerAddon(Domain $domain)
    {
        EE_Register_Addon::register(
            'Barcode_Scanner',
            [
                'class_name' => self::class,
                'version' => $domain->version(),
                'min_core_version' => DOMAIN::CORE_VERSION_REQUIRED,
                'main_file_path' => $domain->pluginFile(),
                'admin_path' => $domain->adminPath(),
                'autoloader_paths' => [
                    'Barcode_Scanner_Admin_Page' => $domain->adminPath() . 'Barcode_Scanner_Admin_Page.core.php',
                    'Barcode_Scanner_Admin_Page_Init' => $domain->adminPath()
                                                         . 'Barcode_Scanner_Admin_Page_Init.core.php',
                ],
                'module_paths' => [
                    $domain->pluginPath() . 'domain/services/modules/EED_Barcode_Scanner.module.php',
                ],
                'shortcode_fqcns' => [
                    EspressoBarcodeScanner::class
                ],
                'pue_options' => [
                    'pue_plugin_slug' => 'eea-barcode-scanner',
                    'checkPeriod' => '24',
                    'use_wp_update' => false,
                ],
                'capabilities' => [
                    'administrator' => [
                        'ee_manage_scanner'
                    ],
                ]
            ]
        );
    }

    // phpcs:disable PSR1.Methods.CamelCapsMethodName.NotCamelCaps
    /**
     * Things to set up immediately after the add-on has been registered with EE.
     */
    public function after_registration()
    {
        $this->registerDependencies();
        parent::after_registration();
    }


    /**
     * Used to register dependencies.
     */
    private function registerDependencies()
    {
        $this->dependencyMap()->add_alias(
            Domain::class,
            DomainInterface::class,
            BarcodeScannerAssetManager::class
        );
        $this->dependencyMap()->registerDependencies(
            BarcodeScannerAssetManager::class,
            [
                AssetCollection::class => EE_Dependency_Map::load_from_cache,
                Domain::class => EE_Dependency_Map::load_from_cache,
                Registry::class => EE_Dependency_Map::load_from_cache
            ]
        );
    }
}
