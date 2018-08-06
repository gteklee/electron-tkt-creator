const Sonar = require('../../server/Sonar.js');
const Towers = require('../modules/Towers.js');
const Radios = require('../modules/Radios.js');
const Packages = require('../modules/Packages');
const Tickets = require('../ticket-templates.js');
module.exports = {

    /**
     * Display the ticket template form.
     * 
     * @param {String} currentSection
     * @param {Function} cb (callback)
     */
    displayForm: function(currentSection, cb)
    {
        $(currentSection).removeClass('input-block').addClass('input-block-hidden');
        $('#input-ticket-template').removeClass('input-block-hidden').addClass('input-block-container');
        //$('#input-ticket-submit').removeClass('input-block-hidden').addClass('input-block');
        $('#back-btn').removeClass('bbtn-container-hidden').addClass('bbtn-container');
        //this.currentSection = '#input-ticket-template';
        cb('#input-ticket-template');
    },

    /**
     * Display account confirmation for user to 
     * confirm account pulled from Sonar.
     * 
     * @param {String} currentSection
     * @param {String} name
     */
    displayAccountConfirmation: function(currentSection, name, cb)
    {
        console.log(name);
        console.log(currentSection);
        $('#info-confirm-cst_id').text('Account Found: ' + name);
        $(currentSection).removeClass('input-block-container').addClass('input-block-hidden');
        $('#input-customer-confirm').removeClass('input-block-hidden').addClass('input-block-container');
        cb('#input-customer-confirm');
    },

    /**
     * Displays error message to the user
     * by element id.
     * 
     * @param {String} id 
     * @param {String} message
     */
    displayError: function(id, message)
    {
        $(id).text(message);
    },

    submitTicket: function(data)
    {   
        let template = ''; // Ticket template to submit
        let subject = ''; // Subject of ticket for network escalations
        // Submit ticket based on ticket type
        if(data.tkt_type === 'repair') {
            // Get ticket template to submit
            template = Tickets.templates.repair(data);
        } else if(data.tkt_type === 'install') {
            return;
        } else if(data.tkt_type === 'onsite') {
            return;
        } else if(data.tkt_type === 'relocation') {
            return;
        } else if(data.tkt_type === 'static') {
            // Get ticket template to submit
            template = Tickets.templates.escalations.static(
                data.cst_id, data.cst_name,
                data.radio_management, data.router_mac,
                data.tkt_reason_static, data.tkt_notes
            );
            subject = 'Static IP Request';
        } else if(data.tkt_type === 'key_upgrade') {
            // Get ticket template to submit
            template = Tickets.templates.escalations.key_upgrade(
                data.cst_name, data.cst_id, 
                data.radio_management, data.radio_mac, data.radio_aggregate,
                data.tkt_notes
            );
            subject = 'Key Upgrade Request';
        } else if(data.tkt_type === 'voip') {
            // Get ticket template to submit
            template = Tickets.templates.escalations.voip(
                data.cst_id, data.cst_name, data.cst_status,
                data.voip_mac, data.voip_public,
                data.voip_first, data.voip_registered, data.voip_line,
                data.voip_paid, data.voip_assignment, data.voip_callid,
                data.tkt_reason
            );
            subject = 'VOIP / Nextiva Escalation';
        } else if(data.tkt_type === 'mtl_mdu') {
            // Get ticket template to submit
            template = Tickets.templates.escalations.mtl_mdu(
                data.cst_id, data.cst_name, 
                data.cst_phone, data.cst_unit, 
                data.cst_status, data.tkt_reason
            );
            subject = 'MTL / MDU Escalation';
        } else if(data.tkt_type === 'other') {
            return;
        } else {
            console.error('Ticket type is not recognized "' + data.tkt_type + '"!');
        }
        // Create job on account
        if(data.tkt_type === 'repair' || data.tkt_type === 'install' || data.tkt_type === 'onsite' || data.tkt_type === 'relocation') {
            console.log('Job created!');
            Sonar.Ticket.Submit(data.cst_id, template, sessionStorage.username, sessionStorage.password, (data) => {
                if(data.error) {
                    console.error(data.error);
                    // Show alert for error while submitting
                    if(data.error.status_code === 404 || 422) { // Can't be found / problem with ID
                        this.alert.submission.show('Customer ID does not exist!', true);
                    } 
                    else {
                        this.alert.submission.show('Error: ' + data.error.status_code, true);
                    }
                } 
                else {
                    // Show alert for successful submission
                    this.alert.submission.show('', false);
                }
            });
        } // Create ticket applied to network team
        else if(data.tkt_type === 'mtl_mdu') {
            console.log('Ticket created!');
            Sonar.Ticket.SubmitAsTicket(data.mtl_id, template, subject, sessionStorage.username, sessionStorage.password, (data) => {
                if(data.error) {
                    console.error(data.error);
                    // Show alert for error while submitting
                    if(data.error.status_code === 404 || 422) { // Can't be found / problem with ID
                        this.alert.submission.show('Customer ID does not exist!', true);
                    } 
                    else {
                        this.alert.submission.show('Error: ' + data.error.status_code, true);
                    }
                }
                else {
                    this.alert.submission.show('', false); // Show alert for successful submission
                }
            });
        }
        else if(data.tkt_type === 'static' || data.tkt_type === 'key_upgrade' || data.tkt_type === 'voip') {
            console.log('Ticket created!');
            Sonar.Ticket.SubmitAsTicket(data.cst_id, template, subject, sessionStorage.username, sessionStorage.password, (data) => {
                if(data.error) {
                    console.error(data.error);
                    // Show alert for error while submitting
                    if(data.error.status_code === 404 || 422) { // Can't be found / problem with ID
                        this.alert.submission.show('Customer ID does not exist!', true);
                    } 
                    else {
                        this.alert.submission.show('Error: ' + data.error.status_code, true);
                    }
                }
                else {
                    this.alert.submission.show('', false); // Show alert for successful submission
                }
            });
        }
    },

    /**
     * Gets data from Sonar from the confirmed
     * account ID.
     * 
     * If there is an error, it is passed through
     * the callback as the second paramter
     * in the format of an object:
     * err: {
     *  message: ''
     * }
     * 
     * @param {Number} account // Id of the account
     * @param {Function} cb (callback)
     */
    getCustomerData: function(account, cb)
    {
        let cst_data = { // Collection of customer data
            radio_management: '',
            radio_public: '',
            radio_mac: '',
            radio_type: '',
            cst_package: [],
            cst_service_static: false,
            errors: []
        };

        // Get IP assignments on the account if any
        Sonar.Customer.GetIPAssignments(account, sessionStorage.username, sessionStorage.password, (data) => {
            console.log(data);
            let manage_inv_id; // Inventory item
            if(data.data.length > 0) { // Data was received
                for(let i = 0; i < data.data.length; i++) { // Parse data
                    let assignment = data.data[i];  // IP assignment pulled from Sonar

                    if(assignment.subnet.includes('10.1.')) { cst_data.radio_management = assignment.subnet; cst_data.radio_type = 'UBNT'; manage_inv_id = assignment.assigned_id; } // Radio found
                    else if(assignment.subnet.includes('10.130.')) { cst_data.radio_management = assignment.subnet; cst_data.radio_type = 'Canopy'; manage_inv_id = assignment.assigned_id; } // Radio found
                    else if(assignment.subnet.includes('10.150.')) { cst_data.radio_management = assignment.subnet; cst_data.radio_type = 'ePMP'; manage_inv_id = assignment.assigned_id; } // Radio found
                    else if(assignment.subnet.includes('65.91.199.') || assignment.subnet.includes('65.91.198.')) { cst_data.radio_management = assignment.subnet; cst_data.radio_type = 'Telrad'; manage_inv_id = assignment.assigned_id; } // Radio found
                    else if(assignment.subnet.includes('65.91.196.') || assignment.subnet.includes('65.91.197.')) { cst_data.radio_public = assignment.subnet; } // Static IP
                    else if(assignment.subnet.includes('8.24.')) { cst_data.radio_public = assignment.subnet; } // Static IP
                    else if(assignment.subnet.includes('50.93.')) { cst_data.radio_public = assignment.subnet; } // Static IP
                    else if(assignment.subnet.includes('65.90.')) { cst_data.radio_public = assignment.subnet; } // Static IP
                    else if(assignment.subnet.includes('172.20.')) { cst_data.radio_public = assignment.subnet; } // Static IP
                }
            }
            else {
                cst_data.errors.push('Unable to find IP Assignments on customer account: ' + account);
            }

            // Get MAC of radio equipment from id of inventory item.
            Sonar.Customer.GetInventoryItem(manage_inv_id, sessionStorage.username, sessionStorage.password, (obj) => {
                
                if(obj.data) {
                    for(let i = 0; i < obj.data.fields.length; i++) { // Check each field.
                        let field = obj.data.fields[i];
                        if(field.data == '') { // If field is blank.
                            continue;
                        }

                        if(field.data.length === 17) { // MAC address
                            cst_data.radio_mac = field.data;
                        }
                    }
                }
                else {
                    cst_data.errors.push('Unable to find Inventory Items on customer account: ' + account);
                }

                // Get services on the account if any.
                Sonar.Customer.GetServices(account, sessionStorage.username, sessionStorage.password, (service_data) => {
                    console.log(service_data);
                    for(let i = 0; i < service_data.data.length; i++) { // Determine package by ID
                        let service = service_data.data[i]; // Service package pulled from Sonar
                        if(service.id < 1 || service.id > 10 && service.id < 64 || service.id > 79 && service.id !== 95) {
                            if(service.id === 100) {
                                cst_data.cst_service_static = true;
                            }
                            continue;
                        }
                        // Determine package
                        if(service.id >= 1 && service.id <= 5) { // Residential package
                            cst_data.cst_package[0] = 'Residential';
                            // Get type of package
                            if(service.id === 1) { cst_data.cst_package[1] = 'Steel'; }
                            else if(service.id === 2) { cst_data.cst_package[1] = 'Bronze'; }
                            else if(service.id === 3) { cst_data.cst_package[1] = 'Silver'; }
                            else if(service.id === 4) { cst_data.cst_package[1] = 'Gold'; }
                            else if(service.id === 5) { cst_data.cst_package[1] = 'Platinum'; }

                        } else if(service.id >= 6 && service.id <= 10) { // Business package
                            cst_data.cst_package[0] = 'Business';
                            // Get type of package
                            if(service.id === 6) { cst_data.cst_package[1] = 'Steel'; }
                            else if(service.id === 7) { cst_data.cst_package[1] = 'Bronze'; }
                            else if(service.id === 8) { cst_data.cst_package[1] = 'Silver'; }
                            else if(service.id === 9) { cst_data.cst_package[1] = 'Gold'; }
                            else if(service.id === 10) { cst_data.cst_package[1] = 'Platinum'; }

                        } else if(service.id >= 64 && service.id <= 79) { // Point-To-Point
                            cst_data.cst_package[0] = 'Other';
                            cst_data.cst_package[1] = 'Point-To-Point'
                        } else if(service.id === 95) { // Trade Agreement
                            cst_data.cst_package[0] = 'Other';
                            cst_data.cst_package[1] = 'Trade Agreement'
                        }
                    }
                    // Return customer data
                    cb(cst_data, null);
                });

            });
        });
    },

    /**
     * Checks Sonar for a customer account based
     * on the input ID.
     * 
     * If there is an error, it is passed through
     * the callback as the second parameter
     * in the format of an object:
     * err: {
     *  message: ''
     * }
     * 
     * @param {Function} cb (callback)
     */
    checkForCustomerAccount: function(cb)
    {
        // Check input first
        let id = $('#input-customer-search-cst-id').val();
        let err = { message: '' };

        if(id == '') { // Check blank
            err.message = 'ID cannot be blank!';
            cb(null, err);
        }
        else { // Get customer data from Sonar.
            Sonar.Customer.GetCustomer(id, sessionStorage.username, sessionStorage.password, (data) => {
                if(data.error) { // Handle error
                    if(data.error.status_code == 404 || 422)
                        err.message = 'Customer ID does not exist!';
                    else
                        err.message = 'Inform Admin of Error Code ' + data.error.status_code + '!';

                    cb(null, err);
                }
                else { // Handle received data
                    // Confirm that the correct account was received
                    cb(data);
                }
            });
        }
    },

    /**
     * On tower selection, select the 
     * associated zone.
     * 
     * @param {String} tower
     */
    selectZone: function(tower)
    {   // Get zone
        let zone = Towers.getZone(tower);
        // Select zone
        $('#input-job_zone').val(zone);
    },

    /**
     * On zone selection, set the 
     * appropriate towers for selection.
     * 
     * @param {Number} zone
     */
    setTowerOptions: function(zone)
    {
        let zoneTowers = [];
        let allTowers = Towers.towers;

        $('#input-job_tower').children().remove(); // Remove all options

        if(zone == 0) {
            Towers.createOptions();
        } else {
            for(let i = 0; i < allTowers.length; i++) {
                if(zone == Towers.getZone(allTowers[i].name)) {
                    $('#input-job_tower').append($('<option>', {
                        value: allTowers[i].name,
                        text: allTowers[i].name
                    }));
                }
            }
        }
    },

    /**
     * On radio type selection, set the 
     * appropiate options for radio type, type selection.
     * 
     * @param {Number} type
     */
    setRadioTypeOptions: function(type)
    {
        $('#input-radio_type_type').find('option').remove(); // Remove options

        // Set options based on selected radio type
        if(type === 'UBNT') {
            Radios.UBNT.forEach(element => {
                $('#input-radio_type_type').append($('<option>', {
                    value: element,
                    text: element
                }));
            });
        } 
        else if(type === 'CANOPY') {
            Radios.CANOPY.forEach(element => {
                $('#input-radio_type_type').append($('<option>', {
                    value: element,
                    text: element
                }));
            });
        } 
        else if(type === 'TELRAD') {
            Radios.TELRAD.forEach(element => {
                $('#input-radio_type_type').append($('<option>', {
                    value: element,
                    text: element
                }));
            });
        }
        else {
            console.error('Options for radio type selected not found!');
        }
    },

    /**
     * On service package radio button
     * checked, set the appropriate options
     * for service package dropdown selection
     */
    setServicePackageOptions: function()
    {   
        $('#input-cst_package').find('option').remove(); // Remove options
        
        // Add options based on radio button checked
        if($('#input-cst_package-residential').is(':checked') || $('#input-cst_package-business').is(':checked')) {
            Packages.Default.forEach(element => {
                $('#input-cst_package').append($('<option>', {
                    value: element.value,
                    text: element.text
                }));
            });
        }
        else if($('#input-cst_package-other').is(':checked')) {
            Packages.Other.forEach(element => {
                $('#input-cst_package').append($('<option>', {
                    value: element.value,
                    text: element.text
                }));
            });
        }
        else {
            console.error('Unable to set service package options!');
        }
    },

    /**
     * Enable all fields possibly disabled.
     */
    enableFields: function()
    {
        $('#input-cst_id').prop('disabled', false);          // cst_id
        $('#input-cst_speedtest').prop('disabled', false);   // cst_speedtest
        $('#input-cst_torch').prop('disabled', false);       // cst_torch
        $('#input-radio_speedtest').prop('disabled', false); // radio_speedtest
        $('#input-radio_ap_count').prop('disabled', false);  // radio_ap_count
        $('#input-radio_ccq').prop('disabled', false);       // radio_ccq
        $('#input-radio_quality').prop('disabled', false);   // radio_qual
        $('#input-radio_signal').prop('disabled', false);    // radio_signal
    },

    /**
     * Disable form input fields based on
     * the job type selected.
     * 
     * @param {String} type
     */
    disableFields: function(type)
    {   // Enable all fields possibly disabled before
        this.enableFields();

        if(type === '1') { // Radio down
            $('#input-cst_speedtest').prop('disabled', true); // Disable cst_speedtest
            $('#input-cst_speedtest').val('');
            $('#input-cst_torch').prop('disabled', true); // Disable cst_torch
            $('#input-cst_torch').val('');
            $('#input-radio_speedtest').prop('disabled', true); // Disable radio_speedtest
            $('#input-radio_speedtest').val('');
            $('#input-radio_ap_count').prop('disabled', true); // Disable radio_ap_count
            $('#input-radio_ap_count').val('');
            $('#input-radio_ccq').prop('disabled', true); // Disable radio_ccq
            $('#input-radio_ccq').val('');
            $('#input-radio_quality').prop('disabled', true); // Disable radio_qual
            $('#input-radio_quality').val('');
            $('#input-radio_signal').prop('disabled', true); // Disable radio_signal
        } else if(type === '2') { // No connection
            $('#input-cst_speedtest').prop('disabled', true); // Disable cst_speedtest
            $('#input-cst_speedtest').val('');
            $('#input-radio_speedtest').prop('disabled', true); // Disable radio_speedtest
            $('#input-radio_speedtest').val('');
            $('#input-cst_torch').prop('disabled', true); // Disable cst_torch
            $('#input-cst_torch').val('');
        } else if(type === '3') { // Intermittent connection
            $('#input-cst_speedtest').prop('disabled', true); // Disable cst_speedtest
            $('#input-cst_speedtest').val('');
        } else if(type === '6') { // Conversion
            $('#input-cst_speedtest').prop('disabled', true); // Disable cst_speedtest
            $('#input-cst_speedtest').val('');
            $('#input-radio_speedtest').prop('disabled', true); // Disable radio_speedtest
            $('#input-radio_speedtest').val('');
        } else if(type === '7') { // Onsite
            $('#input-cst_speedtest').prop('disabled', true); // Disable cst_speedtest
            $('#input-cst_speedtest').val('');
            $('#input-radio_speedtest').prop('disabled', true); // Disable radio_speedtest
            $('#input-radio_speedtest').val('');
            $('#input-radio_ccq').prop('disabled', true); // Disable radio_ccq
            $('#input-radio_ccq').val('');
        } else if(type === 'voip-new') {
            $('#input-cst_id').prop('disabled', true); // Disable cst_id
            $('#input-cst_id').val(1).change(); // If blank error
            $('#input-cst_id').val('');
        }
    },

    /**
     * Contains all alerts to the user. 
     */
    alert: {
        /**
         * Alert to the user they clicked the
         * clear form button to confirm.
         */
        clear: {
            show: function() {
                $('.alert-blur').show();
                $('#alert-block-clear').removeClass('alert-block-hidden');
                $('#alert-block-clear').addClass('alert-block');
            },

            close: function() {
                $('#alert-block-clear').removeClass('alert-block');
                $('#alert-block-clear').addClass('alert-block-hidden');
                $('.alert-blur').hide();
            }
        },

        /**
         * Alert to the user they clicked the
         * submit form button.
         */
        submit: {
            show: function() {
                $('.alert-blur').show();
                $('#alert-block-submit').removeClass('alert-block-hidden');
                $('#alert-block-submit').addClass('alert-block');
            },

            close: function() {
                $('#alert-block-submit').removeClass('alert-block');
                $('#alert-block-submit').addClass('alert-block-hidden');
                $('.alert-blur').hide();
            }
        },

        /**
         * Alert to the user if submission of the
         * ticket was successful or not.
         */
        submission: {
            show: function(text, err) {
                $('.alert-blur').show();
                $('#alert-block-submission').removeClass('alert-block-hidden');
                $('#alert-block-submission').addClass('alert-block');
                if(err) {
                    $('#alert-submission-text').text('There was a problem submitting the ticket!')
                    $('#alert-submission-err').text(text);
                    $('#alert-submission-err').css('color', 'red');
                }
                else {
                    $('#alert-submission-text').text('Submission was successful!');
                    $('#alert-submission-text').css('color', 'black');
                    $('#alert-submission-err').text('');
                }
            },
            
            close: function() {
                $('#alert-block-submission').removeClass('alert-block');
                $('#alert-block-submission').addClass('alert-block-hidden');
                $('.alert-blur').hide();
            }
        }
    },
    
    /**
     * When back button is clicked,
     * take the user back one page.
     */
    back: function(currentSection, cb)
    {
        $(currentSection).removeClass('input-block-container').addClass('input-block-hidden');
        $('#input-customer-search').removeClass('input-block-hidden').addClass('input-block-container');
        //$('#input-ticket-submit').removeClass('input-block-hidden').addClass('input-block');
        $('#back-btn').removeClass('bbtn-container').addClass('bbtn-container-hidden');
        cb('#input-customer-search');
    }
};