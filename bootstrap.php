<?php

use EventEspresso\BarcodeScanner\domain\BarcodeScanner;
use EventEspresso\BarcodeScanner\domain\Domain;
use EventEspresso\core\domain\DomainFactory;
use EventEspresso\core\domain\DomainInterface;
use EventEspresso\core\domain\values\FilePath;
use EventEspresso\core\domain\values\FullyQualifiedName;
use EventEspresso\core\domain\values\Version;
use EventEspresso\core\services\loaders\Loader;

add_action('activated_plugin', function () {
    if (WP_DEBUG && defined('EVENT_ESPRESSO_UPLOAD_DIR')) {
        $activation_errors = ob_get_contents();
        file_put_contents(
            EVENT_ESPRESSO_UPLOAD_DIR
            . 'logs/'
            . 'espresso_barcode_scanner_plugin_activation_errors.html',
            $activation_errors
        );
    }
});


add_action('AHEE__EE_System__load_espresso_addons', function () {
    if (defined('EVENT_ESPRESSO_VERSION')
        && class_exists('EE_Addon')
        && class_exists('EventEspresso\core\domain\DomainBase')
        && version_compare(EVENT_ESPRESSO_VERSION, '4.9.59.p', '>')
    ) {
        // register namespace
        EE_Psr4AutoloaderInit::psr4_loader()->addNamespace('EventEspresso\BarcodeScanner', __DIR__);
        EE_Dependency_Map::instance()->add_alias(
            Domain::class,
            DomainInterface::class,
            BarcodeScanner::class
        );
        // register dependencies
        EE_Dependency_Map::register_dependencies(
            BarcodeScanner::class,
            array(
                EE_Dependency_Map::class => EE_Dependency_Map::load_from_cache,
                Domain::class => EE_Dependency_Map::load_from_cache,
                Loader::class => EE_Dependency_Map::load_from_cache
            )
        );
        // initialize add-on
        BarcodeScanner::registerAddon(
            DomainFactory::getShared(
                new FullyQualifiedName(Domain::class),
                array(
                    new FilePath(__FILE__),
                    Version::fromString(EE_BARCODE_SCANNER_VERSION)
                )
            )
        );
    } else {
        add_action('admin_notices', 'eea_barcode_scanner_activation_error');
    }
});

/**
 * This is a simple verification that EE core is active.  If its not, then we need to deactivate and show a notice.
 */
function eea_barcode_scanner_ee4_core_check()
{
    if (! did_action('AHEE__EE_System__load_espresso_addons')) {
        add_action('admin_notices', 'eea_barcode_scanner_activation_error');
    }
}

add_action('init', 'eea_barcode_scanner_ee4_core_check', 1);

/**
 *    displays activation error admin notice
 */
function eea_barcode_scanner_activation_error()
{
    unset($_GET['activate'], $_REQUEST['activate']);
    if (! function_exists('deactivate_plugins')) {
        require_once ABSPATH . 'wp-admin/includes/plugin.php';
    }
    deactivate_plugins(plugin_basename(__FILE__));
    /** phpcs:disable Generic.Files.LineLength.TooLong */
    ?>
    <div class="error">
        <p>
            <?php printf(
                /* Translators: Event Espresso version */
                esc_html__(
                    'Event Espresso Barcode Scanner add-on could not be activated. Please ensure that Event Espresso version %1$s or higher is running',
                    'event_espresso'
                ),
                '4.9.54.p'
            ); ?>
        </p>
    </div>
    <?php
    /** phpcs:enable */
}