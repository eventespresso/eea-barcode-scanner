<?php

defined('EVENT_ESPRESSO_VERSION') || exit('No direct access allowed.');

/**
 * The main module class for the EE Barcode Scanner app.
 *
 * @since      1.0.0
 * @package    EE4 Barcode Scanner
 * @subpackage module
 * @author     Darren Ethier
 */
class EED_Barcode_Scanner extends EED_Module
{


    /**
     * The constant used for referencing the lookup action
     *
     * @type string
     */
    const action_lookup = 'lookup_attendee';


    /**
     * The constant used for referencing the continuous auto check-in/check-out scanning.
     *
     * @type string
     */
    const action_auto = 'toggle_attendee';


    /**
     * The constant used for referencing the continuous check-in with no check-out's allowed scanning.
     *
     * @type string
     */
    const action_no_checkout = 'toggle_attendee_no_checkout';


    /**
     * The constant used for searching by keyword
     *
     * @type string
     */
    const action_search_by_keyword = 'search_by_keyword';


    /**
     * @var        bool
     * @access    public
     */
    public static $shortcode_active = false;


    /**
     * Will hold the ajax response.
     *
     * @since 1.0.0
     * @var array
     */
    protected $_response = array();


    /**
     * @return EED_Barcode_Scanner
     */
    public static function instance()
    {
        return parent::get_instance(__CLASS__);
    }


    /**
     *    set_hooks - for hooking into EE Core, other modules, etc
     *
     * @access    public
     * @return    void
     */
    public static function set_hooks()
    {
        // ajax hooks
        add_action(
            'wp_ajax_ee_barcode_scanner_main_action',
            array('EED_Barcode_Scanner', 'ee_barcode_scanner_main_action')
        );
        add_action(
            'wp_ajax_nopriv_ee_barcode_scanner_main_action',
            array('EED_Barcode_Scanner', 'ee_barcode_scanner_main_action')
        );

        EE_Config::register_route('barcode_scanner', 'Barcode_Scanner', 'run');
    }


    /**
     *    set_hooks_admin - for hooking into EE Admin Core, other modules, etc
     *
     * @access    public
     * @return    void
     */
    public static function set_hooks_admin()
    {
        // ajax hooks
        $bs = self::instance();
        add_action('wp_ajax_ee_barcode_scanner_main_action', array($bs, 'ee_barcode_scanner_main_action'));
        add_action('wp_ajax_nopriv_ee_barcode_scanner_main_action', array($bs, 'ee_barcode_scanner_main_action'));
    }


    /**
     *    run - initial module setup
     *
     * @access    public
     * @param  WP $WP
     * @return    void
     */
    public function run($WP)
    {
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
    }


    /**
     *    enqueue_scripts - Load the scripts and css
     *
     * @access    public
     * @return    void
     */
    public function enqueue_scripts()
    {
        //scanner library
        $script_min = defined('SCRIPT_DEBUG') && SCRIPT_DEBUG ? '' : 'min.';
        wp_register_script(
            'eea-scanner-detection-cps',
            EE_BARCODE_SCANNER_URL
            . 'core/third_party_libraries/scanner_detection/jquery.scannerdetection.compatibility.'
            . $script_min . 'js',
            array('jquery'),
            EE_BARCODE_SCANNER_VERSION,
            true
        );
        wp_register_script(
            'eea-scanner-detection',
            EE_BARCODE_SCANNER_URL
            . 'core/third_party_libraries/scanner_detection/jquery.scannerdetection.'
            . $script_min . 'js',
            array('eea-scanner-detection-cps'),
            EE_BARCODE_SCANNER_VERSION,
            true
        );

        //chosen
        wp_register_script(
            'eea-bs-chosen',
            EE_BARCODE_SCANNER_URL . 'core/third_party_libraries/chosen/chosen.jquery.' . $script_min . 'js',
            array('jquery'),
            EE_BARCODE_SCANNER_VERSION,
            true
        );
        wp_register_style(
            'eea-bs-chosen-css',
            EE_BARCODE_SCANNER_URL . 'core/third_party_libraries/chosen/chosen.' . $script_min . 'css',
            array(),
            EE_BARCODE_SCANNER_VERSION
        );

        //addon js/css
        $scanner_css_dep = 'ee-admin-css';
        if (! is_admin()) {
            wp_register_style(
                'espresso_default',
                EE_GLOBAL_ASSETS_URL . 'css/espresso_default.css',
                array('dashicons'),
                EVENT_ESPRESSO_VERSION
            );
            $scanner_css_dep = 'espresso_default';
        }
        wp_register_style(
            'eea-scanner-detection-css',
            EE_BARCODE_SCANNER_URL . 'css/espresso_ee_barcode_scanner.css',
            array($scanner_css_dep, 'eea-bs-chosen-css'),
            EE_BARCODE_SCANNER_VERSION
        );
        wp_register_script(
            'eea-scanner-detection-core',
            EE_BARCODE_SCANNER_URL . 'scripts/espresso_ee_barcode_scanner.js',
            array('eea-scanner-detection', 'eea-bs-chosen', 'espresso_core'),
            EE_BARCODE_SCANNER_VERSION,
            true
        );

        // is the shortcode or widget in play || is_admin?
        if (EED_Barcode_Scanner::$shortcode_active
            || (
                is_admin()
                && EE_Registry::instance()->REQ->get('page') == 'eea_barcode_scanner'
            )
        ) {
            wp_enqueue_style('eea-scanner-detection-css');
            wp_enqueue_script('eea-scanner-detection-core');
        }
    }


    /**
     * This outputs the initial scanner form for receiving scanning info.
     *
     * @since 1.0.0
     * @param bool $echo if true (default), then echo the form.  Otherwise it just gets returned.
     * @return string
     * @throws DomainException
     * @throws EE_Error
     * @throws \EventEspresso\core\exceptions\EntityNotFoundException
     */
    public function scanner_form($echo = true)
    {

        //user permission check first
        if (! $this->_user_check()) {
            EE_Error::add_error(
                __(
                    'Sorry, but you do not have permissions to access the barcode scanner form.  Please see the site administrator about gaining access',
                    'event_espresso'
                ),
                __FILE__,
                __FUNCTION__,
                __LINE__
            );
            return '';
        }

        //selector for the different default actions after a scan.
        EE_Registry::instance()->load_helper('Form_Fields');
        EE_Registry::instance()->load_helper('Template');
        EE_Registry::instance()->load_helper('URL');
        $action_options = array(
            0 => array(
                'text' => __('Lookup Attendee', 'event_espresso'),
                'id'   => self::action_lookup,
            ),
            1 => array(
                'text' => __('Continuous Scanning', 'event_espresso'),
                'id'   => self::action_auto,
            ),
            2 => array(
                'text' => __('Continuous Check-in Only', 'event_espresso'),
                'id'   => self::action_no_checkout,
            ),
        );

        if (EE_Registry::instance()->CAP->current_user_can(
            'ee_read_checkins',
            'barcode_scanner_simple_lookup'
        )) {
            $action_options[3] =
                array(
                    'text' => __('Search by Keyword', 'event_espresso'),
                    'id'   => self::action_search_by_keyword,
                );
        }

        $action_options = apply_filters('FHEE__EED_Barcode_Scanner__scanner_form__action_options', $action_options);

        //events selector for step one!
        //getting events that are published but not expired.
        //need to use a value for time() depending on what method is available
        $current_time         = method_exists('EEM_Datetime', 'current_time_for_query')
            ? time()
            : current_time('timestamp');
        $filtered_time_window = apply_filters(
            'FHEE__EED_Barcode_Scanner__scanner_form__filtered_time_window',
            -HOUR_IN_SECONDS
        );
        $query = array(
            0          => array(
                'status'               => array('IN', array('publish', EEM_Event::sold_out, 'private')),
                'Datetime.DTT_EVT_end' => array('>', $current_time + $filtered_time_window),
            ),
            'order_by' => array('Datetime.DTT_EVT_start' => 'ASC'),
        );

        //add cap restrictions in the admin
        if (is_admin() && ! (defined('DOING_AJAX') && DOING_AJAX)) {
            $query['caps'] = EEM_Event::caps_read_admin;
        }

        //filter the query so people can add their own conditions if they want.
        $query = apply_filters('FHEE__EED_Barcode_Scanner__scanner_form__event_query', $query);

        $events               = EEM_Event::instance()->get_all($query);
        $event_selector       = $event_name = $dtt_selector = $dtt_name = $dtt_id = $checkin_link = '';

        //if only ONE event then let's just return that and the datetime selector.
        if (count($events) === 1) {
            $event                             = reset($events);
            $this->_response['data']['EVT_ID'] = $event->ID();
            $event_name                        = $event->name();
            $dtt_selector                      = $this->_scanner_action_retrieve_datetimes();
            $dtt_name                          = empty($dtt_selector) && ! empty($this->_response['data']['dtt_name'])
                ? $this->_response['data']['dtt_name']
                : '';
            $dtt_id                            = empty($this->_response['data']['DTT_ID'])
                ? ''
                : $this->_response['data']['DTT_ID'];
            $checkin_link                      = ! empty($dtt_id) ? EEH_URL::add_query_args_and_nonce(array(
                'page'     => 'espresso_registrations',
                'action'   => 'event_registrations',
                'event_id' => $event->ID(),
                'DTT_ID'   => $dtt_id,
            )) : '';
        } else {
            //setup event selector.
            $evt_options[] = array('text' => '', 'id' => '');
            foreach ($events as $event) {
                $evt_options[] = array(
                    'text' => $event->name(),
                    'id'   => $event->ID(),
                );
            }
            $event_selector = EEH_Form_Fields::select_input(
                'eea_bs_event_selector',
                $evt_options,
                '',
                'data-placeholder="Select Event..."',
                'eea-bs-ed-selector-select'
            );
        }

        /**
         * Set defaults for template args.

         */
        $template_args = array(
            '_wpnonce'        => wp_create_nonce('ee_banner_scan_form'),
            'step'            => 1,
            'context'         => is_admin() ? 'admin' : 'frontend',
            'event_name'      => $event_name,
            'event_selector'  => $event_selector,
            'dtt_selector'    => $dtt_selector,
            'dtt_name'        => $dtt_name,
            'dtt_id'          => $dtt_id,
            'checkin_link'    => $checkin_link,
            'reg_content'     => '',
            'action_selector' => EEH_Form_Fields::select_input(
                'scanner_form_default_action',
                $action_options,
                'confirm',
                '',
                'eea-banner-scanner-action-select'
            ),
            'button_class'    => is_admin() ? 'button button-primary' : 'ee-roundish ee-green ee-button',
        );

        //First thing to determine is if we have all the details needed to display a specific record.
        $this->_response['data']['EVT_ID']  = EE_Registry::instance()->REQ->get('EVT_ID');
        $this->_response['data']['DTT_ID']  = EE_Registry::instance()->REQ->get('DTT_ID');
        $this->_response['data']['regcode'] = EE_Registry::instance()->REQ->get('ee_reg_code');
        $doing_lookup                       = false;

        if (! empty($this->_response['data']['EVT_ID'])
            && ! empty($this->_response['data']['DTT_ID'])
            && ! empty($this->_response['data']['regcode'])
        ) {
            $event       = EEM_Event::instance()->get_one_by_ID($this->_response['data']['EVT_ID']);
            $dtt         = EEM_Datetime::instance()->get_one_by_ID($this->_response['data']['DTT_ID']);
            $reg_content = $this->_scanner_action_lookup_attendee();


            if ($event instanceof EE_Event
                && $dtt instanceof EE_Datetime
                && (
                    ! isset($this->_response['error'])
                    || ! $this->_response['error']
                )
            ) {
                $name     = $dtt->name();
                $datename = ! empty($name) ? $name . ' - ' : '';
                $datename .= $dtt->get_dtt_display_name();
                $targs         = array(
                    'step'        => 3,
                    'event_name'  => $event->name(),
                    'dtt_name'    => $datename,
                    'dtt_id'      => $dtt->ID(),
                    'reg_content' => $reg_content,
                );
                $template_args = array_merge($template_args, $targs);
                $doing_lookup  = true;
            }
        }

        if (! $doing_lookup) {
            //template args has not been setup so let's go ahead and setup the selection form.

            $step          = ! empty($event_name) ? 2 : 1;
            $step          = ! empty($dtt_selector) || ! empty($dtt_name) ? 3 : $step;
            $targs         = array(
                'step' => $step,
            );
            $template_args = array_merge($template_args, $targs);
        }

        $template = EE_BARCODE_SCANNER_ADMIN . 'templates/scanner_detection_form.template.php';

        if ($echo) {
            EEH_Template::display_template($template, $template_args);
            return '';
        }
        return EEH_Template::display_template($template, $template_args, true);
    }


    /**
     * This is the wp_ajax callback for the barcode scanner main action.
     *
     * @since 1.0.0
     * @return void
     */
    public function ee_barcode_scanner_main_action()
    {
        //verify user has basic access.
        if (! $this->_user_check()) {
            EE_Error::add_error(
                __(
                    'You do not have permission to perform this action.  Please contact your site administrator about getting the correct permissions.',
                    'event_espresso'
                ),
                __FILE__,
                __FUNCTION__,
                __LINE__
            );
            $this->_response['error'] = true;
            $this->_return_json();
        }

        //verify incoming package.
        $nonce                                                 = EE_Registry::instance()->REQ->get('_wpnonce');
        $action                                                = EE_Registry::instance()->REQ->get('ee_scanner_action');
        $this->_response['data']['regcode']                    = EE_Registry::instance()->REQ->get('ee_reg_code');
        $this->_response['data']['EVT_ID']                     = EE_Registry::instance()->REQ->get('EVT_ID');
        $this->_response['data']['DTT_ID']                     = EE_Registry::instance()->REQ->get('DTT_ID');
        $this->_response['data']['httpReferrer']               = EE_Registry::instance()->REQ->get('httpReferrer');
        $this->_response['data']['ee_scanner_checkin_trigger'] = EE_Registry::instance()->REQ->get(
            'ee_scanner_checkin_trigger'
        );

        if (empty($nonce) || empty($action)) {
            EE_Error::add_error(
                __(
                    'Missing required instructions from scanner request. "_wpnonce" or "ee_scanner_action" is empty.',
                    'event_espresso'
                ),
                __FILE__,
                __FUNCTION__,
                __LINE__
            );
            $this->_response['error'] = true;
            $this->_return_json();
        }

        //add action back into response so ajax_success has an easy way to target success hooks
        $this->_response['data']['ee_scanner_action'] = $action;

        //check_approved flag set?
        $this->_response['data']['check_approved'] = apply_filters(
            'FHEE__EED_Barcode_Scanner__ee_barcode_scanner_main_action__check_approved',
            $action != 'lookup_attendee',
            $this->_response
        );

        //verify nonce
        if (! wp_verify_nonce($nonce, 'ee_banner_scan_form')) {
            EE_Error::add_error(
                __('Invalid request.  Missing a valid nonce in the request.'),
                __FILE__,
                __FUNCTION__,
                __LINE__
            );
            $this->_response['error'] = true;
            $this->_return_json();
        }

        //perform action.
        $method = '_scanner_action_' . $action;
        if (! method_exists($this, $method)) {
            EE_Error::add_error(
                sprintf(
                    __(
                        'The incoming action on the scanner request (%s) is invalid.  Please check the spelling and ensure there is a callback for handling that action defined.',
                        'event_espresso'
                    ),
                    $action
                ),
                __FILE__,
                __FUNCTION__,
                __LINE__
            );
            $this->_response['error'] = true;
            $this->_return_json();
        }

        //ALL is good! let's call the action and return the response.
        $this->_response['content'] = call_user_func(array($this, $method));

        //do_action for the action.yo.
        do_action('AHEE__EED_Barcode_Scanner__ee_barcode_scanner_main_action__' . $action, $this->_response);
        do_action('AHEE__EED_Barcode_Scanner__ee_barcode_scanner_main_action', $action, $this->_response);

        //filter response
        $this->_response = apply_filters(
            'FHEE__EED_Barcode_Scanner__ee_barcode_scanner_main_action__' . $action . '__response',
            $this->_response
        );
        $this->_response = apply_filters(
            'FHEE__EED_Barcode_Scanner__ee_barcode_scanner_main_action__response',
            $this->_response,
            $action
        );
        $this->_return_json();
    }


    /**
     * This retrieves all datetimes for a given event and returns a setup selector for the barcode setup steps.
     *
     * @since 1.0.0
     * @return string
     * @throws EE_Error
     */
    protected function _scanner_action_retrieve_datetimes()
    {
        //have required request var
        if (empty($this->_response['data']['EVT_ID'])) {
            EE_Error::add_error(
                __('Missing required EVT_ID in the request for the retrieve_datetimes action.', 'event_espresso'),
                __FILE__,
                __FUNCTION__,
                __LINE__
            );
            $this->_response['error'] = true;
            return '';
        }

        //get all datetimes
        $current_time         = method_exists('EEM_Datetime', 'current_time_for_query')
            ? time()
            : current_time('timestamp');
        $filtered_time_window = apply_filters(
            'FHEE__EED_Barcode_Scanner__scanner_form__filtered_time_window',
            -HOUR_IN_SECONDS
        );
        $query_args = array(
            0                          => array(
                'Event.EVT_ID' => $this->_response['data']['EVT_ID'],
                'DTT_EVT_end'  => array('>', $current_time + $filtered_time_window),
                'DTT_deleted'  => false,
            ),
            'default_where_conditions' => 'none',
            'order_by'                 => array('DTT_order' => 'ASC'),
        );
        $datetimes            = EEM_Datetime::instance()->get_all($query_args);

        $this->_response['data']['dtt_count'] = count($datetimes);

        if (count($datetimes) === 1) {
            $dtt      = reset($datetimes);
            $name     = $dtt->name();
            $datename = ! empty($name) ? $name . ' - ' : '';
            $datename .= $dtt->get_dtt_display_name();
            $this->_response['data']['dtt_name'] = $datename;
            $this->_response['data']['DTT_ID']   = $dtt->ID();
            $this->_response['success']          = true;
            return '';
        }

        //setup selector
        EE_Registry::instance()->load_helper('Form_Fields');
        $options[] = array(
            'text' => '',
            'id'   => '',
        );
        foreach ($datetimes as $datetime) {
            if ($datetime instanceof EE_Datetime) {
                $name     = $datetime->name();
                $datename = ! empty($name) ? $name . ' - ' : '';
                $datename .= $datetime->get_dtt_display_name();
                $options[] = array(
                    'text' => $datename,
                    'id'   => $datetime->ID(),
                );
            }
        }
        $this->_response['success'] = true;
        return EEH_Form_Fields::select_input(
            'eea_bs_dtt_selector',
            $options,
            '',
            'data-placeholder="Select Datetime..."',
            'eea-bs-ed-selector-select'
        );
    }


    /**
     * This looks up a registrant (attendee) and prepares appropriate response.
     *
     * @since 1.0.0
     * @return string
     * @throws DomainException
     * @throws EE_Error
     * @throws \EventEspresso\core\exceptions\EntityNotFoundException
     */
    protected function _scanner_action_lookup_attendee()
    {
        $registration = $this->_validate_incoming_data(false);

        if (! $registration instanceof EE_Registration) {
            return $registration;
        }

        //alright there IS a registration.  Let's get the template and return.
        EE_Registry::instance()->load_helper('Template');
        $contact = $registration->attendee();

        //get other registrations in group.
        $other_regs = $registration->get_all_other_registrations_in_group();

        //first related checking for the given datetime.
        $checkin        = $registration->get_first_related('Checkin', array(
            array('DTT_ID' => $this->_response['data']['DTT_ID']),
            'order_by' => array('CHK_timestamp' => 'DESC'),
        ));
        $checkin_status = $registration->check_in_status_for_datetime($this->_response['data']['DTT_ID'], $checkin);

        /**
         * The reason for these conditionals is for backward compat with versions of EE core that do not have the
         * check-in status constants defined.
         */
        $checked_in    = defined('EE_Registration::checkin_status_in') ? EE_Registration::checkin_status_in : 1;
        $checked_out   = defined('EE_Registration::checkin_status_out') ? EE_Registration::checkin_status_out : 2;
        $never_checked = defined('EE_Registration::checkin_status_never') ? EE_Registration::checkin_status_never : 0;
        $last_checkin  = $checkin_button_text = $all_checkin_button_text = $checkin_color = '';

        switch ($checkin_status) {
            case $never_checked:
                $last_checkin            = __('Has not been checked in yet.', 'event_espresso');
                $checkin_button_text     = __('Check In', 'event_espresso');
                $all_checkin_button_text = __('Check In All Registrations', 'event_espresso');
                $checkin_color           = ' ee-green';
                break;
            case $checked_in:
                $last_checkin            = sprintf(
                    __("Last checked in on %s", 'event_espresso'),
                    $checkin->get_datetime('CHK_timestamp', 'M j @', 'h:i a')
                );
                $checkin_button_text     = __('Check Out', 'event_espresso');
                $all_checkin_button_text = __('Check Out All Registrations', 'event_espresso');
                $checkin_color           = ' ee-red';
                break;
            case $checked_out:
                $last_checkin            = sprintf(
                    __("Last checked out on %s", 'event_espresso'),
                    $checkin->get_datetime('CHK_timestamp', 'M j @ ', 'h:i a')
                );
                $checkin_button_text     = __('Check In', 'event_espresso');
                $all_checkin_button_text = __('Check In All Registrations ', 'event_espresso');
                $checkin_color           = ' ee-green';
                break;
            case false:
                $last_checkin            = __('Has access to datetime, but not approved.', 'event_espresso');
                $checkin_button_text     = __('Check In Anyways', 'event_espresso');
                $all_checkin_button_text = __('Check In All Registrations', 'event_espresso');
                $checkin_color           = ' ee-yellow';
        }

        //made it here so time pull the attendee lookup template and fill it out and return
        $template_args              = array(
            'avatar'                  => get_avatar($contact->email(), '128', 'mystery'),
            'registration'            => $registration,
            'contact'                 => $contact,
            'other_regs'              => $other_regs,
            'last_checkin'            => $last_checkin,
            'checkin_button_text'     => $checkin_button_text,
            'all_checkin_button_text' => $all_checkin_button_text,
            'transaction'             => $registration->transaction(),
            'DTT_ID'                  => $this->_response['data']['DTT_ID'],
            'checkin_color'           => $checkin_color,
        );
        $template                   = $template = EE_BARCODE_SCANNER_ADMIN
                                                  . 'templates/scanner_attendee_details.template.php';
        $this->_response['success'] = true;
        return EEH_Template::display_template($template, $template_args, true);
    }


    /**
     * This will receive the incoming keyword and will use that to trigger a search on the Checkin list table page for
     * this event and datetime
     *
     * @return string
     * @throws EE_Error
     */
    protected function _scanner_action_search_by_keyword()
    {
        //make sure we have a valid reg_code
        if (empty($this->_response['data']['regcode'])) {
            EE_Error::add_error(
                __('Missing required registration url link code from the request.', 'event_espresso'),
                __FILE__,
                __FUNCTION__,
                __LINE__
            );
            $this->_response['error'] = true;
            return '<span class="ee-bs-barcode-checkin-result dashicons dashicons-no"></span>';
        }

        //verify we have a DTT_ID
        //do we have a dtt_id?
        if (empty($this->_response['data']['DTT_ID'])) {
            EE_Error::add_error(
                __('Missing required datetime ID from the request.', 'event_espresso'),
                __FILE__,
                __FUNCTION__,
                __LINE__
            );
            $this->_response['error'] = true;
            return '<span class="ee-bs-barcode-checkin-result dashicons dashicons-no"></span>';
        }

        if (empty($this->_response['data']['EVT_ID'])) {
            $event  = EEM_Event::instance()->get_one(
                array(
                    array('Datetime.DTT_ID' => $this->_response['data']['DTT_ID'])
                )
            );
            $EVT_ID = $event->ID();
        } else {
            $EVT_ID = $this->_response['data']['EVT_ID'];
        }

        //k those are all we need for the search
        $this->_response['success'] = true;

        EE_Registry::instance()->load_helper('URL');
        $this->_response['redirect'] = EEH_URL::add_query_args_and_nonce(
            array(
                'action'   => 'event_registrations',
                'page'     => 'espresso_registrations',
                'event_id' => $EVT_ID,
                'DTT_ID'   => $this->_response['data']['DTT_ID'],
                's'        => $this->_response['data']['regcode'],
            ),
            admin_url('admin.php')
        );
        return '';
    }


    /**
     * This just validates incoming data for registration toggle actions
     *
     * @since 1.0.0
     * @param bool $check_approved Flags whether to consider the registration status for access.  True = check if reg
     *                             approved.  false = ignore.
     * @return string
     * @throws EE_Error
     */
    private function _validate_incoming_data($check_approved = true)
    {
        if (empty($this->_response['data']['regcode'])) {
            EE_Error::add_error(
                __('Missing required registration url link code from the request.', 'event_espresso'),
                __FILE__,
                __FUNCTION__,
                __LINE__
            );
            $this->_response['error'] = true;
            return '<span class="ee-bs-barcode-checkin-result dashicons dashicons-no"></span>';
        }

        //do we have a dtt_id?
        if (empty($this->_response['data']['DTT_ID'])) {
            EE_Error::add_error(
                __('Missing required datetime ID from the request.', 'event_espresso'),
                __FILE__,
                __FUNCTION__,
                __LINE__
            );
            $this->_response['error'] = true;
            return '<span class="ee-bs-barcode-checkin-result dashicons dashicons-no"></span>';
        }

        //valid registration?
        $reg_code     = strtolower($this->_response['data']['regcode']);
        $registration = EEM_Registration::instance()->get_one(array(
            array(
                'OR' => array(
                    'REG_url_link' => $reg_code,
                    'REG_code'     => $reg_code,
                ),
            ),
        ));

        if (! $registration instanceof EE_Registration) {
            EE_Error::add_error(
                __('Sorry, but the given registration code does not match a valid registration.', 'event_espresso'),
                __FILE__,
                __FUNCTION__,
                __LINE__
            );
            $this->_response['error'] = true;
            return '<span class="ee-bs-barcode-checkin-result dashicons dashicons-no"></span>';
        }

        //k let's make sure this registration has access to the given datetime.
        if (! $registration->can_checkin($this->_response['data']['DTT_ID'], $check_approved)) {
            EE_Error::add_error(
                __(
                    'Sorry, but while the ticket is for a valid registration, this registration does not have access to the given datetime.',
                    'event_espresso'
                ),
                __FILE__,
                __FUNCTION__,
                __LINE__
            );
            $this->_response['success'] = true;
            return '<span class="ee-bs-barcode-checkin-result dashicons dashicons-no"></span>';
        }
        return $registration;
    }


    /**
     * Toggles checkin status for a registration
     *
     * @since 1.0.0
     * @return string
     * @throws EE_Error
     */
    protected function _scanner_action_toggle_attendee()
    {
        $registration = $this->_validate_incoming_data($this->_response['data']['check_approved']);

        if (! $registration instanceof EE_Registration) {
            return $registration;
        }


        //generate the url for this view for returning to if necessary.
        $base_url = is_admin() && ! EE_FRONT_AJAX ? admin_url('admin.php') : null;
        $base_url = empty($base_url) && ! empty($this->_response['data']['httpReferrer'])
            ? $this->_response['data']['httpReferrer']
            : $base_url;
        $base_url = empty($base_url) ? site_url(esc_attr(wp_unslash($_SERVER['REQUEST_URI']))) : $base_url;
        $url      = esc_url(add_query_arg(
            array(
                'EVT_ID'      => $registration->event_ID(),
                'DTT_ID'      => $this->_response['data']['DTT_ID'],
                'ee_reg_code' => $registration->reg_code(),
                'page'        => 'eea_barcode_scanner',
            ),
            $base_url
        ));

        $view_link = ! empty($base_url)
            ? sprintf(__('%1$sReview Record%2$s', 'event_espresso'), '<a href="' . $url . '">', '</a>')
            : '';

        //toggle checkin
        $status = $registration->toggle_checkin_status(
            $this->_response['data']['DTT_ID'],
            $this->_response['data']['check_approved']
        );
        if ($status === 1) {
            EE_Error::add_success(
                sprintf(
                    __('This registration has been checked in. %s', 'event_espresso'),
                    $view_link
                )
            );
            $checked_in_out_text  = __('Checked In', 'event_espresso');
            $checked_in_out_class = ' ee-bs-barcode-checkedin';
        } else {
            EE_Error::add_success(
                sprintf(
                    __('This registration has been checked out. %s', 'event_espresso'),
                    $view_link
                )
            );
            $checked_in_out_text  = __('Checked Out', 'event_espresso');
            $checked_in_out_class = ' ee-bs-barcode-checkedout';
        }
        $this->_response['success'] = true;
        return '<div class="ee-bs-barcode-scanner-checked-status-container">'
               . '<span class="ee-bs-barcode-checkin-result dashicons dashicons-yes'
               . $checked_in_out_class
               . '"></span><p>'
               . $checked_in_out_text
               . '</p></div>';
    }


    /**
     * Toggles checkin status for a registration
     *
     * @since 1.0.6
     * @return string
     * @throws EE_Error
     */
    protected function _scanner_action_toggle_attendee_no_checkout()
    {
        $registration = $this->_validate_incoming_data($this->_response['data']['check_approved']);

        if (! $registration instanceof EE_Registration) {
            return $registration;
        }


        //generate the url for this view for returning to if necessary.
        $base_url = is_admin() && ! EE_FRONT_AJAX ? admin_url('admin.php') : null;
        $base_url = empty($base_url) && ! empty($this->_response['data']['httpReferrer'])
            ? $this->_response['data']['httpReferrer']
            : $base_url;
        $base_url = empty($base_url) ? site_url(esc_attr(wp_unslash($_SERVER['REQUEST_URI']))) : $base_url;
        $url      = esc_url(add_query_arg(
            array(
                'EVT_ID'      => $registration->event_ID(),
                'DTT_ID'      => $this->_response['data']['DTT_ID'],
                'ee_reg_code' => $registration->reg_code(),
                'page'        => 'eea_barcode_scanner',
            ),
            $base_url
        ));

        $view_link = ! empty($base_url)
            ? sprintf(__('%1$sReview Record%2$s', 'event_espresso'), '<a href="' . $url . '">', '</a>')
            : '';

        //first verify whether the registration has ever been checked-in.  If so, then return false because we're not
        // allowing check-outs on this route.
        $checkin_status = $registration->check_in_status_for_datetime($this->_response['data']['DTT_ID']);

        if ($checkin_status !== EE_Registration::checkin_status_never) {
            EE_Error::add_error(
                sprintf(__('This registration has already been checked-in. %s', 'event_espresso'), $view_link),
                __FILE__,
                __FUNCTION__,
                __LINE__
            );
            $this->_response['success'] = true;
            return '<span class="ee-bs-barcode-checkin-result dashicons dashicons-no"></span>';
        } else {
            //toggle checkin
            $status = $registration->toggle_checkin_status(
                $this->_response['data']['DTT_ID'],
                $this->_response['data']['check_approved']
            );
            if ($status === 1) {
                EE_Error::add_success(
                    sprintf(__('This registration has been checked in. %s', 'event_espresso'), $view_link)
                );
            }
            $this->_response['success'] = true;
            return '<span class="ee-bs-barcode-checkin-result dashicons dashicons-yes"></span>';
        }
    }


    /**
     * This takes care of handling the check in or out all attendees action.
     *
     * @since 1.0.0
     * @return string The content for the response
     * @throws EE_Error
     */
    protected function _scanner_action_check_in_or_out_all_attendees()
    {
        $registration = $this->_validate_incoming_data();

        if (! $registration instanceof EE_Registration) {
            return $registration;
        }

        //get all registrations in group.
        $other_regs = $registration->get_all_other_registrations_in_group();

        //first let's toggle the main registration, and that way we'll know what status we need to set the others to
        $status = $registration->toggle_checkin_status($this->_response['data']['DTT_ID']);
        if ($status === 1) {
            EE_Error::add_success(__('All registrations in the group have been checked in.', 'event_espresso'));
            $this->_response['data']['checkout_button_class'] = 'ee-red';
            $this->_response['data']['buttonText']            = __('Check Out All Registrations', 'event_espresso');
        } else {
            EE_Error::add_success(__('All registrations in the group have been checked out', 'event_espresso'));
            $this->_response['data']['checkout_button_class'] = 'ee-green';
            $this->_response['data']['buttonText']            = __('Check In All Registrations', 'event_espresso');
        }
        $this->_response['success'] = true;
        $content                    = '<span class="ee-bs-barcode-checkin-result dashicons dashicons-yes"></span>';

        //next let's toggle all the other registrations
        foreach ($other_regs as $reg) {
            $cur_status = $reg->check_in_status_for_datetime($this->_response['data']['DTT_ID']);
            if ($cur_status == $status || $cur_status === false) {
                continue;
            }

            $reg->toggle_checkin_status($this->_response['data']['DTT_ID']);
        }
        return $content;
    }


    /**
     * This toggles the checkin status for a secondary attendee listed as part of the group of the looked up attendee.
     *
     * @since 1.0.0
     * @return string
     * @throws EE_Error
     */
    protected function _scanner_action_toggle_secondary_attendee()
    {
        $registration = $this->_validate_incoming_data();

        if (! $registration instanceof EE_Registration) {
            return $registration;
        }


        //toggle checkin
        $status                                 = $registration->toggle_checkin_status(
            $this->_response['data']['DTT_ID']
        );
        $checkin                                = $registration->get_first_related('Checkin');
        $this->_response['data']['last_update'] = $checkin->get_datetime('CHK_timestamp', 'M j @', 'h:i a');
        if ($status === 1) {
            EE_Error::add_success(__('This group registration has been checked in.', 'event_espresso'));
            $this->_response['data']['checkout_icon_class']   = 'ee-icon-check-in';
            $this->_response['data']['buttonText']            = __('Check Out', 'event_espresso');
            $this->_response['data']['checkout_button_class'] = 'ee-red';
        } else {
            EE_Error::add_success(__('This group registration has been checked out', 'event_espresso'));
            $this->_response['data']['checkout_icon_class']   = 'ee-icon-check-out';
            $this->_response['data']['buttonText']            = __('Check In', 'event_espresso');
            $this->_response['data']['checkout_button_class'] = 'ee-green';
        }
        $this->_response['success'] = true;
        return '';
    }


    /**
     * Helper method for checking user permissions on running a scan.
     * Note by default, all wp-admin implementations of the scanning form (and related actions) are only permissible to
     * users with the ee_edit_checkin capability.  However, when the shortcode is used to output the form it allows for
     * ANY user to do the scans.  This is filterable however.  The reason for this is because it is possible that users
     * want to allow self-checkin.  It IS possible for admins to still control the integrity of frontend scanning by
     * using the shortcode on a password protected post.
     *
     * @since 1.0.0
     * @return bool  yes if user can, no if user can't.
     */
    private function _user_check()
    {
        /**
         * Note: The reason why we check for both `ee_edit_checkins` and `ee_edit_checkin` is for backwards
         * compatibility. See https://events.codebasehq.com/projects/event-espresso/tickets/10910 for more details.
         * We had documentation that promoted the usage of `ee_edit_checkin` so its quite possible users had that cap
         * as a part of a custom role.  It is preferable to use `ee_edit_checkins` as the cap.  `ee_edit_checkin` is a
         * meta cap that should never be directly assigned to a user or role.
         * The reason for the filter we remove (and add back) before and after doing the current_user_can check is
         * because with the work introduced in core for
         * https://events.codebasehq.com/projects/event-espresso/tickets/10569, the `ee_edit_checkin` cap check will
         * fail EVEN if the user has that explicit cap access because in 10569 we FIXED the bug with how meta caps were
         * working.
         */
        remove_filter('map_meta_cap', array(EE_Capabilities::instance(), 'map_meta_caps'), 10);
        $has_access = is_admin()
               && ! EE_FRONT_AJAX
            ? EE_Capabilities::instance()->current_user_can('ee_edit_checkins', 'do_barcode_scan')
              || EE_Capabilities::instance()->current_user_can('ee_edit_checkin', 'do_barcode_scan')
            : apply_filters('EED_Barcode_Scanner__scanner_form__user_can_from_shortcode', true);
        add_filter('map_meta_cap', array(EE_Capabilities::instance(), 'map_meta_caps'), 10, 4);
        return $has_access;
    }


    /**
     * Handles prepping and returning the json object on an ajax request.
     */
    private function _return_json()
    {
        //temporarily force `is_admin()` to return true if we're in frontend ajax then reset after.
        $cached_screen = null;
        if (EE_FRONT_AJAX) {
            $cached_screen             = isset($GLOBALS['current_screen']) ? $GLOBALS['current_screen'] : null;
            $GLOBALS['current_screen'] = WP_Screen::get('front');
        }
        $default_response = array(
            'error'      => false,
            'success'    => false,
            'notices'    => EE_Error::get_notices(),
            'content'    => '',
            'data'       => array(),
            'isEEajax'   => true,
            'isFrontend' => EE_FRONT_AJAX && is_admin() || ! is_admin(),
        );
        $this->_response  = array_merge($default_response, $this->_response);
        //restore current screen global
        if (EE_FRONT_AJAX) {
            $GLOBALS['current_screen'] = $cached_screen;
        }

        // make sure there are no php errors or headers_sent.  Then we can set correct json header.
        if (null === error_get_last() || ! headers_sent()) {
            header('Content-Type: application/json; charset=UTF-8');
        } else {
            header('Content-Type: html; charset=UTF-8');
        }

        echo json_encode($this->_response);
        exit();
    }


    /**
     *        @ override magic methods
     *        @ return void
     */
    public function __set($a, $b)
    {
        return false;
    }

    public function __get($a)
    {
        return false;
    }

    public function __isset($a)
    {
        return false;
    }

    public function __unset($a)
    {
        return false;
    }

    public function __clone()
    {
        return false;
    }

    public function __wakeup()
    {
        return false;
    }

    public function __destruct()
    {
        return false;
    }
}
