/**
 * Escalations Object. Each function relative to each 
 * network escalation page is stored in this object. 
 * Listeners then use the escalations object to make 
 * appropriate function calls.
 * 
 * Functions:
 * 
 * Static() :: void
 * Key() :: void
 * Voip() :: void
 * Multi() :: void
 * Other() :: void
 */
let Escalations = new function()
{
    /**
     * Static deals with all functionality of the
     * static ip escalation process.
     */
/**/this.Static = new function()
    {
        this.error = false;
        this.errorMsg = '';
        this.currentSection = '#input-customer-search'; // Initialize current section.

        /**
         * All required data when the request is submitted.
         */
        this.TicketData = {
            acct: null,

            customer_id:        '',
            customer_name:      '',
            cst_package:        '',
            cst_static_service: false,

            radio_managed:      '',
            router_mac:         '',

            tkt_reason:         '',
            tkt_notes:          ''
        }

        /**
         * Get the customer that the user is searching for.
         * @param {*} id 
         * @param {*} name 
         */
        this.getCustomer = function(id)
        {
            this.id = id;
            this.name = '';
            this.Sonar = require('../server/Sonar.js');

            this.Sonar.Customer.GetCustomer(this.id, sessionStorage.username, sessionStorage.password, (data) => {
                
                if(data.error)
                {
                    this.error = true;

                    if(data.error.status_code == 404 || 422)
                        this.errorMsg = 'Customer ID does not exist!';
                    else
                        this.errorMsg = 'Inform Admin of Error Code ' + data.error.status_code + '!';

                    this.displayError('#err-cst_id');
                }
                else
                {
                    this.confirmAccountFound(data);
                }
            });
        }

        /**
         * When the account is retreived and confirmed,
         * this automatically fills all information
         * that can be retreived from the account.
         */
        this.fillTicketForm = function()
        {
            this.Sonar = require('../server/Sonar.js');
            this.account = this.TicketData.acct.data;
            this.TicketData.customer_id = this.account.id;
            this.TicketData.customer_name = this.account.name;

            /** IP assignments */
            this.Sonar.Customer.GetIPAssignments(this.account.id, sessionStorage.username, sessionStorage.password, (data) => {
                console.log(data);
                // Get all ip assignments as long as ips are assigned.
                if(data.data.length > 0)
                {
                    let managed_inventory_id; // Inventory item.
                    let ip; // IP.

                    // Get managed ip, public ip, and radio type.
                    for(let i = 0; i < data.data.length; i++)
                    {
                        let assignment = data.data[i];  // Ip assignment pulled from Sonar.

                        // Determine ips.
                        if(assignment.subnet.indexOf('10.1.') > -1) { this.TicketData.radio_managed = assignment.subnet; } // Radio
                        else if(assignment.subnet.indexOf('10.130.')  > -1) { this.TicketData.radio_managed = assignment.subnet; } // Radio
                        else if(assignment.subnet.indexOf('10.150.')  > -1) { this.TicketData.radio_managed = assignment.subnet; } // Radio
                        else if(assignment.subnet.indexOf('65.91.199.')  > -1 || assignment.subnet.indexOf('65.91.198.')  > -1) { this.TicketData.radio_managed = assignment.subnet; } // Radio
                    }

                    this.getServices();
                }
                else
                {
                    this.getServices();
                }
            });

            /**
             * Fill ticket form.
             */
            this.fillTicket = function()
            {
                let _ = this.TicketData;
                console.log(_.customer_id);
                console.log(_.customer_name);
                console.log(_.radio_managed);
                console.log(_.cst_package);
                console.log(_.cst_static_service);

                this.clearTicket();

                // Fill out the appropriate values.
                if(_.customer_id != '') $('#input-static-customer_id').val(_.customer_id);       // Customer ID.
                if(_.customer_name != '') $('#input-static-customer_name').val(_.customer_name); // Customer Name.
                if(_.radio_managed != '') $('#input-static-radio_managed').val(_.radio_managed); // Radio managed IP.

                this.displayForm();
            }

            // Clear ticket form.
            this.clearTicket = function()
            {
                $('#input-repair-customer_id').val('');
                $('#input-repair-customer_name').val('');
                $('#input-repair-radio_managed').val('');
                $('#input-repair-radio_public').val('');
                $('#input-repair-radio_mac').val('');
            }

            this.getServices = function()
            {
                /** Customer services */
                this.Sonar.Customer.GetServices(this.account.id, sessionStorage.username, sessionStorage.password, (data) => {
                    console.log(data);
                    // Determine package by id.
                    for(let i = 0; i < data.data.length; i++)
                    {
                        let service = data.data[i]; // Service package pulled from Sonar.

                        // Make sure this is a package we want to look at.
                        if(service.id < 1 || service.id > 10 && service.id < 64 || service.id > 79 && service.id != 95)
                        {
                            if(service.id == 100)
                                this.TicketData.cst_static_service = true;

                            continue;
                        }

                        // Determine package.
                        if(service.id >= 1 && service.id <= 5) // Res
                        {
                            this.TicketData.cst_package = 'Residential';
                        }
                        else if(service.id >= 6 && service.id <= 10) // Bus
                        {
                            this.TicketData.cst_package = 'Business';
                        }
                        else if(service.id >= 64 && service.id <= 79) // PTP
                        {
                            this.TicketData.cst_package = 'Point-To-Point';
                        }
                        else if(service.id == 95) // Trade
                        {
                            this.TicketData.cst_package = 'Trade Agreement';
                        }
                    }
                    this.fillTicket();
                });
            }
        }

        /**
         * Error check and Submit ticket form.
         */
        this.submitTicketForm = function()
        {
            this.Sonar = require('../server/Sonar.js');
            let _ = this.TicketData;

            // Get data from form.
            _.customer_id = $('#input-static-customer_id').val(); 
            _.customer_name = $('#input-static-customer_name').val();

            _.radio_managed = $('#input-static-radio_managed').val();
            _.router_mac = $('#input-static-router_mac').val();

            _.tkt_reason = $('#input-static-tkt_reason').val();
            _.tkt_notes = $('#input-static-tkt_notes').val();

            // Create string template.
            let template = '<p>Escalating Reason: ' + _.tkt_reason + '<br>';
            template += 'Date: ' + (new Date().toLocaleDateString()) + '</p>';
            template += '<p>Customer Name: ' + _.customer_name + '<br>';
            template += 'Customer ID: ' + _.customer_id + '</p>';
            template += '<p>Managed IP:   ' + _.radio_managed + '<br>';
            template += 'Router MAC Address:  ' + _.router_mac + '</p>';

            if(_.tkt_notes != '')
                template += '<p>Notes: ' + _.tkt_notes + '</p>';

            //console.log(_);
            console.log(template);
            
            // Check if Static IP Service was added yet.
            if(this.TicketData.cst_package === 'Residential' && !this.TicketData.cst_static_service) 
            {
                this.Sonar.Customer.GetServices(_.customer_id, sessionStorage.username, sessionStorage.password, (data) => {
                    
                    if(data.error)
                    {
                        console.log('Problem with services: ' + data.error);
                    }

                    for(let i = 0; i < data.data.length; i++)
                    {
                        let service = data.data[i]; // Service package pulled from Sonar.

                        // Make sure this is a package we want to look at.
                        if(service.id == 100) {
                            this.TicketData.cst_static_service = true;
                            break;
                        }
                    }

                    if(!this.TicketData.cst_static_service)
                    {
                        $('#succ-submit').removeClass('success-msg').addClass('err-msg');
                        $('#succ-submit').text('Static IP Service needs to be added to the account!');
                        $('#succ-submit').fadeIn();
                        window.setTimeout(() => {$('#succ-submit').fadeOut('slow')}, 10000);
                        return;
                    }
                });
            }
            else {
                this.Sonar.Ticket.SubmitAsTicket(_.customer_id, template, 'Static IP Request', sessionStorage.username, sessionStorage.password, (data) => {

                    if(data.error)
                    {
                        $('#succ-submit').removeClass('success-msg').addClass('err-msg');

                        if(data.error.status_code == 422)
                            $('#succ-submit').text('Invalid Customer ID!');
                        else
                            $('#succ-submit').text('Error Submitting Ticket!');
                        
                        $('#succ-submit').fadeIn();
                        window.setTimeout(() => {$('#succ-submit').fadeOut('slow')}, 10000);
                        return;
                    }
                    else
                    {
                        console.log(data);
                        $('#succ-submit').removeClass('err-msg').addClass('success-msg');
                        $('#succ-submit').text('Ticket Submitted!');
                        $('#succ-submit').fadeIn();
                        window.setTimeout(() => {$('#succ-submit').fadeOut('slow')}, 10000);
                    }
                });
            }

        }

        /**
         * Takes the data returned when an account is found
         * with the provided id and then presents the user
         * to make sure the correct acount was pulled.
         * @param {*} obj
         */
        this.confirmAccountFound = function(obj)
        {
            this.clearTicketData();
            this.TicketData.acct = obj; // Store account retreived.

            // Set the appropriate text to user.
            // Name of customer is pulled from object retreived from Sonar.
            $('#info-confirm-cst_id').text('Account Found: ' + this.TicketData.acct.data.name);

            this.displayAccountConfirmation();  // Display account confirmation section.
        }

        /**
         * Clears the data in TicketData for a new customer.
         */
        this.clearTicketData = function()
        {
            let _ = this.TicketData;

            _.customer_id = '';
            _.customer_name = '';
            _.cst_package = '';
            _.radio_managed = '';
            _.router_mac = '';
            _.tkt_reason = '';
            _.tkt_notes = '';
            _.cst_static_service = false;
        }

        /**
         * Displays the account confirmation section.
         */
        this.displayAccountConfirmation = function()
        {
            $(this.currentSection).removeClass('input-block').addClass('input-block-hidden');
            $('#input-customer-confirm').removeClass('input-block-hidden').addClass('input-block');
            //$('#back-btn').removeClass('bbtn-container-hidden').addClass('bbtn-container');
            this.currentSection = '#input-customer-confirm';
        }

        /**
         * Display the ticket request template form.
         */
        this.displayForm = function()
        {
            $(this.currentSection).removeClass('input-block').addClass('input-block-hidden');
            $('#input-ticket-template').removeClass('input-block-hidden').addClass('input-block');
            //$('#input-ticket-submit').removeClass('input-block-hidden').addClass('input-block');
            $('#back-btn').removeClass('bbtn-container-hidden').addClass('bbtn-container');
            this.currentSection = '#input-ticket-template';
        }

        /**
         * Clear all repair ticket form fields.
         */
        this.clearTicketForm = function()
        {
            $('#input-static-customer_id').val('');
            $('#input-static-customer_name').val('');
            $('#input-static-radio_managed').val('');
            $('#input-static-router_mac').val('');
            $('#input-static-tkt_reason').val('');
            $('#input-static-tkt_notes').val('');
        }

        /**
         * Alert the user they clicked clear.
         */
        this.alertClear = function()
        {
            $('.alert-blur').show();
            $('#alert-block-clear').removeClass('alert-block-hidden');
            $('#alert-block-clear').addClass('alert-block');
        }

        /**
         * Cancel clear of ticket.
         */
        this.alertClearClose = function()
        {
            $('#alert-block-clear').removeClass('alert-block');
            $('#alert-block-clear').addClass('alert-block-hidden');
            $('.alert-blur').hide();
        }

        /**
         * Alert the user they clicked submit.
         */
        this.alertSubmit = function()
        {
            $('.alert-blur').show();
            $('#alert-block-submit').removeClass('alert-block-hidden');
            $('#alert-block-submit').addClass('alert-block');
        }

        /**
         * Cancel submission of ticket.
         */
        this.alertSubmitClose = function()
        {
            $('#alert-block-submit').removeClass('alert-block');
            $('#alert-block-submit').addClass('alert-block-hidden');
            $('.alert-blur').hide();
        }

        /**
         * Check if the ID is empty.
         * @param {String} id 
         */
        this.checkEmptyId = function(id)
        {
            this.id = id;

            if(this.id == '')
            {
                this.error = true;
                this.errorMsg = 'ID cannot be blank!';
            }
            else
                this.resetError('#err-cst_id')
                
            if(this.error)
            {
                this.displayError('#err-cst_id');
                return;
            }

            this.getCustomer(this.id);
        }

        /**
         * If there is an error and this function is called,
         * then the error message is displayed to the user.
         * @param {*} id -> element location of error message
         */
        this.displayError = function(id)
        {
            if(this.error)
                $(id).text(this.errorMsg);
        }

        /**
         * Resets error message when error is resolved.
         * @param {*} id -> element location of error message.
         */
        this.resetError = function(id)
        {
            this.error = false;
            this.errorMsg = '';
            $(id).text('');
        }

        /**
         * When back button is clicked, take user
         * back to search for customer.
         */
        this.back = function()
        {
            location.reload();
        }
    }

}

/** STATIC Event listeners */

/**
 * "CHECK ACCOUNT" button clicked event.
 */
$('#btn-static-customer-check').on('click', () => {
    Escalations.Static.checkEmptyId($('#input-static-customer-id').val());
});

/**
 * "DENY" button clicked event.
 */
$('#btn-static-customer-deny').on('click', () => {
    Escalations.Static.back();
});

/**
 * "CONFIRM" button clicked event.
 */
$('#btn-static-customer-confirm').on('click', () => {
    Escalations.Static.fillTicketForm();
});


/**
 * Show ticket template.
 */
$('#btn-static-create-ticket').on('click', () => {
    Escalations.Static.clearTicketForm();
    Escalations.Static.displayForm();
});

/**
 * "SUBMIT" button clicked event.
 */
$('#btn-static-tkt-submit').on('click', () => {
    Escalations.Static.alertSubmit();
    //Tickets.Repair.submitTicketForm();
});
    // Alert box with buttons when submit button is clicked above.
    /**
     * "SUBMIT" confirm button clicked event.
     */
    $('#btn-submit-confirmation-submit').on('click', () => {
        Escalations.Static.alertSubmitClose();
        Escalations.Static.submitTicketForm();
    });

    /**
     * "CANCEL" button clicked event.
     */
    $('#btn-submit-confirmation-cancel').on('click', () => {
        Escalations.Static.alertSubmitClose();
    });

/**
 * "CLEAR" button clicked.
 */
$('#btn-static-tkt-clear').on('click', () => {
    Escalations.Static.alertClear();
});
    // Alert box with buttons when clear button is clicked above.
    /**
     * "CLEAR" confirm button clicked event.
     */
    $('#btn-clear-confirmation-clear').on('click', () => {
        Escalations.Static.alertClearClose();
        Escalations.Static.clearTicketForm();
    });

    /**
     * "CANCEL" button clicked event.
     */
    $('#btn-clear-confirmation-cancel').on('click', () => {
        Escalations.Static.alertClearClose();
    });

/**
 * Back Button clicked event.
 */
$('#back-btn-icon').on('click', () => {
    Escalations.Static.back();
});