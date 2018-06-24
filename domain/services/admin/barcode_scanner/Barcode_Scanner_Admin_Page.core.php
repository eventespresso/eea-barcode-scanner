<?php

use EventEspresso\BarcodeScanner\domain\Domain;
use EventEspresso\BarcodeScanner\domain\services\assets\BarcodeScannerAssetManager;
use EventEspresso\core\exceptions\EntityNotFoundException;
use EventEspresso\core\exceptions\InvalidDataTypeException;
use EventEspresso\core\exceptions\InvalidInterfaceException;
use EventEspresso\core\services\loaders\LoaderFactory;

/**
 * Admin Page class for EE4 Barcode Scanner
 *
 * @since 1.0.0
 * @see    EE_Admin_Page for all phpdocs related to core methods here that are not documented.
 * @package EE4 Barcode Scanner
 * @subpackage admin
 * @author Darren Ethier
 */
class Barcode_Scanner_Admin_Page extends EE_Admin_Page
{

    /**
     * @var Domain
     */
    private $domain;

    /**
     * Barcode_Scanner_Admin_Page constructor.
     *
     * @param bool $routing
     * @throws EE_Error
     * @throws InvalidArgumentException
     * @throws ReflectionException
     * @throws InvalidDataTypeException
     * @throws InvalidInterfaceException
     */
    public function __construct($routing = true)
    {
        $this->domain = LoaderFactory::getLoader()->getShared(Domain::class);
        parent::__construct($routing);
    }

    protected function _init_page_props()
    {
        $this->page_slug = Domain::ADMIN_PAGE_SLUG;
        $this->_admin_base_url = $this->domain->adminPageUrl();
        $this->_admin_base_path = $this->domain->adminPath();
        $this->page_label = $this->domain->adminPageLabel();
    }


    protected function _define_page_props()
    {
        $this->_admin_page_title = $this->page_label;
        $this->_labels = array();
    }


    protected function _set_page_routes()
    {
        $this->_page_routes = [
            'default' => [
                'func' => '_barcode_scanner',
                'capability' => 'ee_read_checkins'
            ],
            'testing' => [
                'func' => 'testingNew',
                'capability' => 'ee_read_checkins'
            ]
        ];
    }



    protected function _set_page_config()
    {
        $this->_page_config = [
            'default' => [
                'nav' => [
                    'label' => __('Barcode Scanning', 'event_espresso'),
                    'order' => 5
                ],
                'help_tabs' => [
                    'barcode_scanning_overview_help_tab' => [
                        'title' => __('Overview', 'event_espresso'),
                        'filename' => 'barcode_scanner_overview'
                    ],
                    'barcode_scanning_shortcode_help_tab' => [
                        'title' => __('Front-end Ticket Scanning', 'event_espresso'),
                        'filename' => 'barcode_scanner_shortcode'
                    ]
                ]
            ],
            'testing' => [
                'nav' => [
                    'label' => 'Temp Testing',
                    'order' => 10
                ]
            ]
        ];
    }



    // below in the next group are things that aren't used but have to be defined.
    protected function _ajax_hooks()
    {
    }
    protected function _add_screen_options()
    {
    }
    protected function _add_feature_pointers()
    {
    }
    public function admin_init()
    {
        EED_Barcode_Scanner::instance()->run(null);
    }

    public function admin_init_default()
    {
        EED_Barcode_Scanner::instance()->run(null);
    }

    public function admin_notices()
    {
    }
    public function admin_footer_scripts()
    {
    }
    public function load_scripts_styles()
    {
    }


    public function load_scripts_styles_testing()
    {
        wp_enqueue_script(BarcodeScannerAssetManager::JS_HANDLE_SCANNER_APP);
        wp_enqueue_style(BarcodeScannerAssetManager::CSS_HANDLE_SCANNER_APP);
    }

    /**
     * Handles outputting the scanning form.
     * Note that this grabs the form and all related files etc from the EED_Barcode_Scanner module.
     *
     * @since 1.0.0
     *
     * @return string html output.
     * @throws DomainException
     * @throws EE_Error
     * @throws InvalidArgumentException
     * @throws InvalidDataTypeException
     * @throws InvalidInterfaceException
     * @throws ReflectionException
     * @throws EntityNotFoundException
     */
    protected function _barcode_scanner()
    {
        $this->_template_args['admin_page_content'] = EED_Barcode_Scanner::instance()->scanner_form(false);
        $this->display_admin_page_with_no_sidebar();
    }


    /**
     * @throws DomainException
     * @throws EE_Error
     */
    protected function testingNew()
    {
        $this->_template_args['admin_page_content'] = '<div id="root"></div>';
        $this->display_admin_page_with_no_sidebar();
    }
}
