<?php

namespace EventEspresso\BarcodeScanner\domain;

use EventEspresso\core\domain\DomainBase;

/**
 * Domain
 *
 * @package EventEspresso\BarcodeScanner\domain
 * @author  Darren Ethier
 * @since   $VID:$
 */
class Domain extends DomainBase
{
    const CORE_VERSION_REQUIRED = '4.9.54.p';
    const ADMIN_PAGE_SLUG = 'eea_barcode_scanner';


    /**
     * @return string
     */
    public function adminPath()
    {
        return $this->pluginPath() . 'domain/services/admin/barcode_scanner/';
    }


    /**
     * @return string
     */
    public function adminUrl()
    {
        return $this->adminUrl() . 'domain/services/admin/barcode_scanner/';
    }


    /**
     * @return string
     */
    public function adminPageUrl()
    {
        return admin_url('admin.php?page=' . self::ADMIN_PAGE_SLUG);
    }


    /**
     * @return string
     */
    public function adminPageLabel()
    {
        return esc_html__('Barcode Scanner', 'event_espresso');
    }

}
