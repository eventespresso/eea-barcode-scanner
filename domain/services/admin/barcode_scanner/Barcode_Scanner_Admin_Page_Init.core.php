<?php

use EventEspresso\BarcodeScanner\domain\Domain;
use EventEspresso\core\exceptions\InvalidDataTypeException;
use EventEspresso\core\exceptions\InvalidInterfaceException;
use EventEspresso\core\services\loaders\LoaderFactory;

/**
 * Admin init class for EE4 Barcode Scanner
 *
 * @since 1.0.0
 * @see    EE_Admin_Page_Init for all phpdocs related to core methods here that are not documented.
 * @package EE4 Barcode Scanner
 * @subpackage admin
 * @author Darren Ethier
 */
class Barcode_Scanner_Admin_Page_Init extends EE_Admin_Page_Init
{

    /**
     * @var Domain
     */
    private $domain;


    /**
     * Barcode_Scanner_Admin_Page_Init constructor.
     *
     * @throws InvalidArgumentException
     * @throws InvalidDataTypeException
     * @throws InvalidInterfaceException
     */
    public function __construct()
    {
        $this->domain = LoaderFactory::getLoader()->getShared(Domain::class);
        parent::__construct();
        $this->_folder_path = $this->domain->adminPath();
    }


    protected function _set_init_properties()
    {
        $this->label = esc_html__('Barcode Scanning', 'event_espresso');
    }


    protected function _set_menu_map()
    {
        $this->_menu_map = new EE_Admin_Page_Sub_Menu(array(
            'menu_group' => 'addons',
            'menu_order' => '20',
            'show_on_menu' => EE_Admin_Page_Menu_Map::BLOG_ADMIN_ONLY,
            'parent_slug' => 'espresso_events',
            'menu_slug' => Domain::ADMIN_PAGE_SLUG,
            'menu_label' => $this->domain->adminPageLabel(),
            'capability' => 'ee_read_checkins',
            'admin_init_page' => $this
            ));
    }
}
