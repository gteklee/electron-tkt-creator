const sonar = require('./Sonar-test');
const towers = require('./Towers-test');
const radios = require('./Radios');
const packages = require('./Packages');
const tickets = require('../ticket-templates');

const client = sonar.createClient(sessionStorage.username, sessionStorage.password);

// All similar ticket processes handled here
module.exports = {

    /**
     * Submit ticket to Sonar.
     * @param {Object} data 
     */
    submitTicket: function(data) {
        // Init important data
        let template = '';          // Ticket template for submission
        let template_disco = '';    // Ticket template for relocation disconnect
        let template_inst = '';     // Ticket template for relocation installation
        let subject = '';           // Subject of ticket for network escalations
        let client = sonar.createClient(sessionStorage.username, sessionStorage.password);

        // Get ticket information template if appropriate
        if(data.tkt_type === tickets.types.repair) { // Repair ticket
            template = tickets.templates.repair(data);
        }
        else if(data.tkt_type === tickets.types.install) { // Install ticket
            template = tickets.templates.install(data);
            subject = 'Zone ' + data.job_zone + ' - ' + data.job_tower + 
                ' - ' + data.job_time + ' Install - ' + data.cst_name;
        }
        else if(data.tkt_type === tickets.types.onsite) { // Onsite ticket
            template = tickets.templates.onsite(data);
        }
        else if(data.tkt_type === tickets.types.relo) { // Relocation ticket
            template_disco = tickets.templates.relo.disco(data, false);
            template_inst = tickets.templates.relo.install(data, true);
            template = template_disco + template_inst;
            subject = 'Zone ' + data.job_zone + ' - ' + data.job_tower + 
                ' - ' + data.job_time + ' Install - ' + data.cst_name;
        }
        else if(data.tkt_type === tickets.types.static) { // Static ip escalation
            template = tickets.templates.escalations.static(
                data.cst_id, data.cst_name, data.radio_management,
                data.router_mac, data.tk_reason_static, data.tkt_notes
            );
            subject = 'Static IP Request';
        }
        else if(data.tkt_type === tickets.types.key) { // Key upgrade escalation
            template = tickets.templates.escalations.key_upgrade(
                data.cst_name, data.cst_id, data.radio_management,
                data.radio_mac, data.radio_aggregate, data.tkt_notes
            );
            subject = 'Key Upgrade Request';
        }
        else if(data.tkt_type === tickets.types.voip) { // VoIP escalation
            template = tickets.templates.escalations.voip(
                data.cst_id, data.cst_name, data.cst_status, data.voip_mac, 
                data.voip_public, data.voip_first, data.voip_registered, 
                data.voip_line, data.voip_paid, data.voip_assignment, 
                data.voip_callid, data.tkt_reason
            );
            subject = 'VOIP / Nextiva Escalation';
        }
        else if(data.tkt_type === tickets.types.mdu) { // MTL / MDU escalation
            template = tickets.templates.escalations.mtl_mdu(data);
            subject = 'MTL / MDU Escalation';
        }
        else if(data.tkt_type === tickets.types.survey) { // Site survey ticket
            template = tickets.templates.survey(data);
        } else {
            console.error('Ticket type is not recognized "' + data.tkt_type + '"!');
        }

        // Create job on the account
        // Repair or Onsite tickets
        if(data.tkt_type === tickets.types.repair || data.tkt_type === tickets.types.onsite) {

            // Make submission to Sonar.
            sonar.ticket.submitAsJob(data.cst_id, template, null, 2, client,
                data => {
                    if(data.error) { // Error response
                        console.error(data.error);
                        // Show alert for error while submitting
                        if(data.error.status_code === 404 || 422) {
                            this.alert.submitted.show('Customer ID does not exist!', true);
                        } else {
                            this.alert.submitted.show('Error: ' + data.error.status_code, true);
                        }
                    }
                    else { // Success
                        this.alert.submitted.show('', false);
                    }
            });

        } // Survey tickets
        else if(data.tkt_type === tickets.types.survey) {

            // Make submission to Sonar.
            sonar.ticket.submitAsJob(data.cst_id, template, null, 8, client,
                data => {
                    if(data.error) { // Error response
                        console.error(data.error);
                        // Show alert for error while submitting
                        if(data.error.status_code === 404 || 422) {
                            this.alert.submitted.show('Customer ID does not exist!', true);
                        } else {
                            this.alert.submitted.show('Error: ' + data.error.status_code, true);
                        }
                    }
                    else { // Success
                        this.alert.submitted.show('', false);
                    }
            });

        } // MTL / MDU tickets
        else if(data.tkt_type === tickets.types.mdu) {

            // Make submission to Sonar.
            sonar.ticket.submitAsTicket(data.mtl_id, template, subject, 13, 16, client,
                data => {
                    if(data.error) {
                        console.error(data.error);
                        // Show alert for error while submitting
                        if(data.error.status_code === 404 || 422) { // Can't be found / problem with ID
                            this.alert.submitted.show('Customer ID does not exist!', true);
                        } 
                        else {
                            this.alert.submitted.show('Error: ' + data.error.status_code, true);
                        }
                    }
                    else {
                        this.alert.submitted.show('', false); // Show alert for successful submission
                    }
            });

        } // Static, Key Upgrade, and VoIP escalations
        else if(data.tkt_type === tickets.types.static || data.tkt_type === tickets.types.key || data.tkt_type === tickets.types.voip) {

            // Make submission to Sonar.
            sonar.ticket.submitAsTicket(data.cst_id, template, subject, 1, 1, client,
                data => {
                    if(data.error) {
                        console.error(data.error);
                        // Show alert for error while submitting
                        if(data.error.status_code === 404 || 422) { // Can't be found / problem with ID
                            this.alert.submitted.show('Customer ID does not exist!', true);
                        } 
                        else {
                            this.alert.submitted.show('Error: ' + data.error.status_code, true);
                        }
                    }
                    else {
                        this.alert.submitted.show('', false); // Show alert for successful submission
                    }
            });

        } // Install ticket
        else if(data.tkt_type === tickets.types.install) {

            // Make submission to Sonar.
            sonar.ticket.submitAsTicket(data.cst_id, template, subject, 2, 8, client,
                (data_asTicket) => {
                    if(data_asTicket.error) {
                        console.error(data_asTicket.error);
                        // Show alert for error while submitting
                        if(json.error.status_code === 404 || 422) { // Can't be found / problem with ID
                            this.alert.submitted.show('Customer ID does not exist!', true);
                        } 
                        else {
                            this.alert.submitted.show('Error: ' + data_asTicket.error.status_code, true);
                        }
                    }
                    else {
                        if(data_asTicket.data.id) {
                            sonar.ticket.submitAsJob(data_asTicket.data.assignee_id, template, data_asTicket.data.id, 1, client,
                                (data_asJob) => {
                                    if(data_asJob.error) {
                                        console.error(data_asJob.error);
                                        // Show alert for error while submitting
                                        if(data_asJob.error.status_code === 404 || 422) { // Can't be found / problem with ID
                                            this.alert.submitted.show('Customer ID does not exist!', true);
                                        } 
                                        else {
                                            this.alert.submitted.show('Error: ' + data_asJob.error.status_code, true);
                                        }
                                    }
                                    else {
                                        this.alert.submitted.show('', false);
                                    }
                                });
                        }
                        else {
                            console.error('ERROR: Ticket ID');
                            sonar.ticket.submitAsJob(data_asTicket.assignee_id, template, null, 1, client,
                                (data_asJob) => {
                                    if(data_asJob.error) {
                                        console.error(data_asJob.error);
                                        // Show alert for error while submitting
                                        if(data.error.status_code === 404 || 422) {
                                            this.alert.submitted.show('Ticket Created -- Error Creating Job...', true);
                                        }
                                        else {
                                            this.alert.submitted.show('Ticket Created -- Error Creating Job...' + data_asJob.error.status_code, true);
                                        }
                                    }
                                    else {
                                        this.alert.submitted.show('Unable to link Job to Ticket!', false);
                                    }
                                });
                        }
                    }
                });

        }
        else if(data.tkt_type === tickets.types.relo) {

            // Make submission to Sonar.
            sonar.ticket.submitAsJob(data.cst_data, template, null, 9, client, 
                data => {
                    if(data.error) {
                        console.error(data.error);
                        // Show alert for error while submitting
                        if(data.error.status_code === 404 || 422) { // Can't be found / problem with ID
                            this.alert.submitted.show('Customer ID does not exist!', true);
                        } 
                        else {
                            this.alert.submitted.show('Error: ' + json.error.status_code, true);
                        }
                    }
                    else {
                        // Create relo disco job
                        sonar.ticket.submitAsJob(data.cst_data, template, null, 15, client,
                            data => {
                                if(data.error) {
                                    console.error(data.error);
                                    // Show alert for error while submitting
                                    if(json.error.status_code === 404 || 422) { // Can't be found / problem with ID
                                        this.alert.submitted.show('Customer ID does not exist!', true);
                                    } 
                                    else {
                                        this.alert.submitted.show('Error: ' + json.error.status_code, true);
                                    }
                                }
                                else {
                                    this.alert.submitted.show('', false); // Show alert for successful submission
                                }
                            });
                    }
                });
        }
    },

    /**
     * Check Sonar for the customer account based on the input ID.
     * @param {*} callback 
     */
    checkForCustomerAccountById: function(id, callback) {
        // Init error response
        let err = { message: '' };

        // Check id
        if(id == '') { // blank
            err.message = 'ID cannot be blank!';
            callback(null, err);
        } else {
            // Make Sonar request
            sonar.customer.getAccount(id, sonar.createClient(sessionStorage.username, sessionStorage.password), 
                data => {
                    if(data.error) { // handle error
                        if(data.error.status_code == 404 || 422) {
                            err.message = 'Customer ID does not exist!';
                        } else {
                            err.message = 'Inform admin of error code ' + data.error.status_code + '!';
                        }

                        callback(null, err);
                    } else {
                        callback(data);
                    }
            });
        }
    },

    /**
     * Get customer data from Sonar by id:
     * ip assignments,
     * inventory items,
     * & services.
     * @param {Number} id 
     * @param {Function} callback 
     */
    getCustomerDataById: function(id, callback) {
        // Init customer data to be collected.
        let cst_data = {
            radio_management: '',
            radio_public: '',
            radio_mac: '',
            radio_type: '',
            cst_package: [],
            cst_service_static: false,
            errors: []
        };
        // Init client
        let client = sonar.createClient(sessionStorage.username, sessionStorage.password);
        // Get ip assignments if any
        sonar.customer.getAccountIpAssignments(id, client, 
            data => {
                let manage_inv_id; // inventory item
                if(data.data.length > 0) {
                    for(let i = 0; i < data.data.length; i++) {
                        // ip assignment
                        let assignment = data.data[i];

                        // Check for radio
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
                } else { // No data received
                    cst_data.errors.push('Unable to find IP Assignments on customer account: ' + id);
                }

                // Get MAC of radio equipment from id of inventory item
                sonar.customer.getInventoryItemById(manage_inv_id, client,
                    obj => {
                        if(obj.data) { // 
                            for(let i = 0; i < obj.data.fields.length; i++) { // Check each field.
                                let field = obj.data.fields[i];
                                if(field.data == '') { // If field is blank.
                                    continue;
                                }
        
                                if(field.data.length === 17) { // MAC address
                                    cst_data.radio_mac = field.data;
                                }
                            }
                        } else {
                            cst_data.errors.push('Unable to find Inventory Items on customer account: ' + id);
                        }

                        // Get services on the account
                        sonar.customer.getAccountServicesById(id, client, 
                            service_data => {
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
                                callback(cst_data, null);
                        });
                });
        });
    },

    /**
     * Set the appropriate options for the radio type by type.
     * @param {Number} type 
     */
    setRadioTypeOptions: function(type) {
        // Remove optoins
        $('#input-radio_type_type').find('option').remove();

        // Set the options based on selected type
        if(type === 'UBNT') {
            radios.UBNT.forEach(element => {
                $('#input-radio_type_type').append($('<option>', {
                    value: element,
                    text: element
                }));
            });
        } 
        else if(type === 'CANOPY') {
            radios.CANOPY.forEach(element => {
                $('#input-radio_type_type').append($('<option>', {
                    value: element,
                    text: element
                }));
            });
        } 
        else if(type === 'TELRAD') {
            radios.TELRAD.forEach(element => {
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
     * On zone selection, set the appropriate towers 
     * for selection.
     * 
     * @param {Number} zone 
     * @param {Function} callback 
     */
    setTowerOptionsByZone(zone, callback) {
        // Get all towers to show
        let allTowers = towers.getTowers();

        // Get selected tower
        let selectedTower = $('#input-job_tower option:selected').val() || '';

        // Generate options
        if(zone == 0) {
            this.createTowerOptions();
        }
        else {
            $('#input-job_tower').children().remove(); // Remove all options
            for(let i = 0; i < allTowers.length; i++) {
                if(zone == towers.getZone(allTowers[i].name)) {
                    $('#input-job_tower').append($('<option>', {
                        value: allTowers[i].name,
                        text: allTowers[i].name
                    }));
                }
            }
        }

        // Reset originally selected tower
        callback(selectedTower);
    },

    createTowerOptions: function() {
        // Get all towers to create options
        let allTowers = towers.getTowers();

        // Remove current options
        $('#input-job_tower').children().remove();

        // Create blank option
        $('input-job-tower').append($('<option>', {
            value: '',
            text: '',
        }));

        // Create tower options
        for(let i = 0; i < allTowers.length; i++) {
            $('input-job-tower').append($('<option>', {
                value: allTowers[i].name,
                text: allTowers[i].name
            }));
        }
    },

    /**
     * Set appropriate options for service package dropdown
     * selection.
     */
    setServicePackageOptions: function() {
        // Remove all options
        $('#input-cst_package').find('option').remove();

        // Add options based on radio button checked
        if($('#input-cst_package-residential').is(':checked') || $('#input-cst_package-business').is(':checked')) {
            packages.Default.forEach(element => {
                $('#input-cst_package').append($('<option>', {
                    value: element.value,
                    text: element.text
                }));
            });
        }
        else if($('#input-cst_package-other').is(':checked')) {
            packages.Other.forEach(element => {
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
     * Select the correct zone based on tower selection.
     * @param {String} tower 
     */
    selectZone: function(tower) {
        $('#input-job_zone').val(towers.getZone(tower));
    },

    /**
     * Enable all fields possibly disabled.
     */
    enableFields: function() {
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
     * Disable form input fields based on the job type selected.
     * @param {String} type 
     */
    disableFields: function(type) {
        // Re-enable all fields
        this.enableFields();

        // Check what fields to disable
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
        }
    },

    /**
     * Display the ticket template form, hiding the current section.
     * @param {String} currentSection 
     * @param {Function} callback 
     */
    displayForm: function(currentSection, callback) {
        $(currentSection).removeClass('input-block').addClass('input-block-hidden');
        $('#input-ticket-template').removeClass('input-block-hidden').addClass('input-block-container');
        $('#back-btn').removeClass('bbtn-container-hidden').addClass('bbtn-container');
        $('#input-cst_name').change(); // Force event
        callback('#input-ticket-template'); // new section
    },

    /**
     * Display account confirmation for user to confirm account 
     * pulled from Sonar.
     * 
     * @param {String} currentSection
     * @param {String} name
     * @param {Function} callback
     */
    displayAccountConfirmation: function(currentSection, name, callback) {
        $('#info-confirm-cst_id').text('Account Found: ' + name);
        $(currentSection).removeClass('input-block-container').addClass('input-block-hidden');
        $('#input-customer-confirm').removeClass('input-block-hidden').addClass('input-block-container');
        callback('#input-customer-confirm');
    },

    /**
     * Error message to user by element id.
     * @param {String} id 
     * @param {String} message 
     */
    displayError: function(id, message) {
        $(id).text(message);
    },

    // Contains all alerts ot the user.
    alert: {

        // Clear form button alert.
        clear: {

            /**
             * Show user they clicked clear button.
             */
            show: function() {
                $('.alert-blur').show();
                $('#alert-block-clear').removeClass('alert-block-hidden');
                $('#alert-block-clear').addClass('alert-block');
            },

            /**
             * Close the clear alert.
             */
            close: function() {
                $('#alert-block-clear').removeClass('alert-block');
                $('#alert-block-clear').addClass('alert-block-hidden');
                $('.alert-blur').hide();
            }
        },

        // Submit form button alert.
        submit: {

            /**
             * Show user they clicked submit form button.
             */
            show: function() {
                $('.alert-blur').show();
                $('#alert-block-submit').removeClass('alert-block-hidden');
                $('#alert-block-submit').addClass('alert-block');
            },

            /**
             * Close the submit form alert.
             */
            close: function() {
                $('#alert-block-submit').removeClass('alert-block');
                $('#alert-block-submit').addClass('alert-block-hidden');
                $('.alert-blur').hide();
            }
        },

        // Form has been submitted
        submitted: {

            /**
             * Show user results of submission.
             * @param {String} text 
             * @param {Object} err 
             */
            show: function(text, err) {
                $('.alert-blur').show();
                $('#alert-block-submission').removeClass('alert-block-hidden');
                $('#alert-block-submission').addClass('alert-block');

                // Check results
                if(err) {
                    $('#alert-submission-text').text('There was a problem submitting the ticket!')
                    $('#alert-submission-err').text(text);
                    $('#alert-submission-err').css('color', 'red');
                }
                else {
                    $('#alert-submission-text').text('Submission was successful!');
                    $('#alert-submission-text').css('color', 'black');
                    $('#alert-submission-err').text(text);
                    $('#alert-submission-err').css('color', 'red');
                }
            },

            /**
             * Close the results alert of the submitted form.
             */
            close: function() {
                $('#alert-block-submission').removeClass('alert-block');
                $('#alert-block-submission').addClass('alert-block-hidden');
                $('.alert-blur').hide();
            }
        }
    },

    /**
     * Take the user back to the specified section.
     * @param {String} currentSection 
     * @param {Function} callback 
     */
    back: function(currentSection, callback) {
        $(currentSection).removeClass('input-block-container').addClass('input-block-hidden');
        $('#input-customer-search').removeClass('input-block-hidden').addClass('input-block-container');
        $('#back-btn').removeClass('bbtn-container').addClass('bbtn-container-hidden');
        callback('#input-customer-search'); // New section
    }
};