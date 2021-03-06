const Processes = require('./modules/Processes.js'); // All common processes with the form.
let Tickets = new function() // All form specific processes.
{
    this.Handler = new function()
    {
        this._error = false;    // PRIVATE BOOL
        this._errorMsg = '';    // PRIVATE STRING
        // Initialize current section.
        this._currentSection = '#input-customer-search'; // PRIVATE STRING
        // All ticket input data
        this._ticketData = {    // PRIVATE OBJECT
            acct_obj: null,

            cst_id: '',
            cst_name: '',
            cst_status: '',

            voip_mac: '',
            voip_public: '',

            voip_first: '',
            voip_registered: '',
            voip_line: '',

            voip_paid: '',
            voip_assignment: '',
            voip_callid: '',

            tkt_reason: '',

            tkt_type: 'voip'
        }; 

        /**
         * Ticket Form handler
         */
        this.form = {
            that: this, // Bind this (Tickets) to 'that'
            input_ids: builder.getInputIds(), // All form input ids
            /**
             * Clear all repair ticket form fields.
             */
            clear: function()
            {
                for(let i = 0; i < this.input_ids.length; i++) {
                    $('#input-' + this.input_ids[i]).val('');
                }
                $('#input-cst_email').val('').attr('disabled', true); // email field
                // voip_first radio buttons
                $('input[type=radio][name=voip_first]:checked').prop('checked', false);
                // voip_registered radio buttons
                $('input[type=radio][name=voip_registered]:checked').prop('checked', false);
                // voip_line radio buttons
                $('input[type=radio][name=voip_line]:checked').prop('checked', false);
                // voip_paid radio buttons
                $('input[type=radio][name=voip_paid]:checked').prop('checked', false);
                // voip_assignment radio buttons
                $('input[type=radio][name=voip_assignment]:checked').prop('checked', false);
            },

            /**
             * Fill the ticket with customer data
             * pulled from Sonar.
             */
            fill: function()
            {   // Set values of the data in the ticket form
                this.clear();
                for(let i = 0; i < this.input_ids.length; i++) {
                    $('#input-' + this.input_ids[i]).val(this.that.getTicketDataProperty(this.input_ids[i]));
                }
                // Show ticket form.
                Processes.displayForm(this.that.getCurrentSection(), 
                    (string) => this.that.setCurrentSection(string));
                console.log(this.input_ids);
            },

            /**
             * Handle the submission of the form
             * to Sonar.
             */
            submit: function()
            {
                Processes.alert.submit.close();
                // Update ticket data with user input
                for(let prop in this.that.getTicketData()) {
                    // Skip these fields
                    if(prop === 'acct_obj' || prop === 'tkt_type') {
                        continue;
                    } 
                    else if(prop === 'cst_status') {
                        if($('#input-cst_status-new').is(':checked')) {
                            this.that.setTicketDataProperty(prop, 'New Customer');
                        }
                        else if($('#input-cst_status-current').is(':checked')) {
                            this.that.setTicketDataProperty(prop, 'Current Customer');
                        }
                    }
                    else if(prop === 'voip_assignment') {
                        if($('#input-voip_assignment-new').is(':checked')) {
                            this.that.setTicketDataProperty(prop, 'New');
                        }
                        else if($('#input-voip_assignment-ported').is(':checked')) {
                            this.that.setTicketDataProperty(prop, ('Ported: ' + $('#input-cst_email').val()));
                        }
                    }
                    else if(prop === 'voip_paid') {
                        if($('#input-voip_paid-yes').is(':checked')) {
                            this.that.setTicketDataProperty(prop, 'Yes');
                        }
                        else if($('#input-voip_paid-no').is(':checked')) {
                            this.that.setTicketDataProperty(prop, 'No');
                        }
                    }
                    else if(prop === 'voip_first') {
                        if($('#input-voip_first-yes').is(':checked')) {
                            this.that.setTicketDataProperty(prop, 'Yes');
                        } 
                        else if($('#input-voip_first-no').is(':checked')) {
                            this.that.setTicketDataProperty(prop, 'No');
                        }
                    }
                    else if(prop === 'voip_registered') {
                        if($('#input-voip_registered-yes').is(':checked')) {
                            this.that.setTicketDataProperty(prop, 'Yes');
                        } 
                        else if($('#input-voip_registered-no').is(':checked')) {
                            this.that.setTicketDataProperty(prop, 'No');
                        }
                    }
                    else if(prop === 'voip_line') {
                        if($('#input-voip_line-yes').is(':checked')) {
                            this.that.setTicketDataProperty(prop, 'Yes');
                        } 
                        else if($('#input-voip_line-no').is(':checked')) {
                            this.that.setTicketDataProperty(prop, 'No');
                        }
                    }
                    else {
                        this.that.setTicketDataProperty(prop, $('#input-' + prop).val());
                    }
                }
                console.log(Tickets.Handler.getTicketData());
                Processes.submitTicket(Tickets.Handler.getTicketData());
                this.that.clearTicketData();
            }

        }

        /**
         * Handle account received after the user
         * searches for a customer.
         * 
         * @param {Object} data
         */
        this.handleCustomerAccount = function(data)
        {
            this.form.clear(); // Make a clean form
            this.setTicketData({ acct_obj: data }); // Store customer data
            Processes.displayAccountConfirmation(this.getCurrentSection(), this.getTicketDataProperty('acct_obj').data.name, 
                (string) => this.setCurrentSection(string));
        }

        /**
         * Handle data received from Sonar based on the
         * confirmed account.
         * 
         * @param {Object} data
         */
        this.handleCustomerData = function(data)
        {   // Set customer info
            data.cst_id = this.getTicketDataProperty('acct_obj').data.id;
            data.cst_name = this.getTicketDataProperty('acct_obj').data.name;

            this.setTicketData(data); // Set ticket data pulled from Sonar
            this.form.fill();
        }

        /** PRIVATE VARIABLE GETTERS / SETTERS */

        /**
         * Check if error exists.
         */
        this.hasError = function()
        {
            return this._error;
        }
        /**
         * Set error.
         * @param {boolean} bool 
         */
        this.setError = function(bool)
        {
            this._error = bool;
        }
        /**
         * Get error message if any.
         */
        this.getErrorMessage = function()
        {
            return this._errorMsg;
        }
        /**
         * Set error message.
         * @param {String} string 
         */
        this.setErrorMessage = function(string)
        {
            this._errorMsg = string;
        }
        /**
         * Resets the error and error message.
         */
        this.resetError = function()
        {
            this.setErrorMessage('');
            this.setError(false);
            Processes.displayError('#err-search-cst_id', this.getErrorMessage());
        }
        /**
         * Displays an error passed as an object
         * to the user.
         * 
         * @param {Object} obj
         * @param {String} id 
         */
        this.handleErrorObject = function(errObj, id)
        {
            if(errObj.message) {
                this.setError(true);
                this.setErrorMessage(errObj.message);
                Processes.displayError(id, this.getErrorMessage());
            }
            else
                console.error('Error Object incorrect format!');
        }

        /**
         * Get current section.
         */
        this.getCurrentSection = function()
        {
            return this._currentSection;
        }
        /**
         * Set current section to jquery appropriate
         * string (#ID, .CLASS, etc).
         * 
         * @param {*} string 
         */
        this.setCurrentSection = function(string)
        {
            this._currentSection = string;
        }

        /**
         * Set Ticket Data from user input.
         * 
         * @param {Object} obj 
         */
        this.setTicketData = function(obj)
        {
            for(let prop in obj) {
                if(this._ticketData.hasOwnProperty(prop)) {
                    this._ticketData[prop] = obj[prop];
                }
                else {
                    console.error('Property "' + prop + '" does not exist!');
                }
            }
        }
        /**
         * Clear all properties of the Ticket Data object.
         */
        this.clearTicketData = function()
        {
            for(let prop in this.getTicketData()) {
                if(prop === 'acct_obj' || prop === 'tkt_type' || prop === 'radio_type' || prop === 'cst_package') {
                    continue; // Skip these properties
                } else {
                    this.setTicketDataProperty(prop, '');
                }
            }
        }
        /**
         * Set property of the Ticket Data object.
         * 
         * @param {String} property
         * @param {*} val 
         */
        this.setTicketDataProperty = function(property, val)
        {
            if(this._ticketData.hasOwnProperty(property)) {
                this._ticketData[property] = val;
                //console.log(this._ticketData[property]);
            }
            else {
                console.error('Property "' + property + '" does not exist!')
            }
        }
        /**
         * Get the ticket data object.
         */
        this.getTicketData = function()
        {
            return this._ticketData;
        }
        /**
         * Get property of the Ticket Data object.
         * 
         * @param {String} property 
         */
        this.getTicketDataProperty = function(property)
        {
            if(this._ticketData.hasOwnProperty(property)) {
                return this._ticketData[property];
                console.log(this._ticketData[property]);
            }
        }
    }
}










/** Event listeners */

/**
 * Submit ticket on click.
 * "SUBMIT" button
 */
$('#btn-tkt-submit').on('click', () => {
    Processes.alert.submit.show();
});
    // Alert box with buttons when submit button is clicked above.
    /**
     * "SUBMIT" confirm button clicked event.
     */
    $('#btn-submit-confirmation-submit').on('click', () => {
        Tickets.Handler.form.submit();
    });
        // "OKAY" button for submission of ticket.
        $('#btn-submission-close').on('click', () => {
            Processes.alert.submitted.close();
        });
    /**
     * "CANCEL" button clicked event.
     */
    $('#btn-submit-confirmation-cancel').on('click', () => {
        Processes.alert.submit.close();
    });

/**
 * Show ticket template on click.
 */
$('#btn-create-tkt').on('click', () => {
    Tickets.Handler.form.clear();
    Processes.displayForm(Tickets.Handler.getCurrentSection(), 
        (string) => Tickets.Handler.setCurrentSection(string));
});

/**
 * Search Sonar for customer.
 * "CHECK ACCOUNT" button
 */
$('#btn-check-acnt').on('click', () => {
    Processes.checkForCustomerAccountById($('#input-customer-search-cst-id').val(),
    (data, err) => {
        if(err) {   // Handle error
            Tickets.Handler.handleErrorObject(err, '#err-search-cst_id');
        }
        else {  // Show data received
            Tickets.Handler.resetError();
            Tickets.Handler.handleCustomerAccount(data);
        }
    });
});
    // Confirm Account alert when above is clicked.
    /**
     * "CONFIRM" button clicked event.
     * Fill ticket form with information pulled from
     * Sonar.
     */
    $('#btn-cst-confirm').on('click', () => {
        Processes.getCustomerDataById(Tickets.Handler.getTicketDataProperty('acct_obj').data.id, 
        (data, err) => {
            if(err) {  // Handle error
                Tickets.Handler.handleErrorObject(err, '#info-confirm-cst_id');
            }
            else {
                Tickets.Handler.resetError();
                Tickets.Handler.handleCustomerData(data);
            }
        });
    });
    /**
     * "DENY" button clicked event.
     * Go back to customer search.
     */
    $('#btn-cst-deny').on('click', () => {
        Processes.back(Tickets.Handler.getCurrentSection(), 
            (string) => Tickets.Handler.setCurrentSection(string));
    });

/**
 * Clear ticket template.
 */
$('#btn-tkt-clear').on('click', () => {
    Processes.alert.clear.show();
});
    // Alert box with buttons when clear button is clicked above.
    /**
     * "CLEAR" confirm button clicked event.
     */
    $('#btn-clear-confirmation-clear').on('click', () => {
        Processes.alert.clear.close();
        Tickets.Handler.form.clear();
    });

    /**
     * "CANCEL" button clicked event.
     */
    $('#btn-clear-confirmation-cancel').on('click', () => {
        Processes.alert.clear.close();
    });

$('#back-btn').on('click', () => {
    Processes.back(Tickets.Handler.getCurrentSection(), 
        (string) => Tickets.Handler.setCurrentSection(string));
});

/**
 * Disable appropriate fields depending
 * on selected job type.
 */
$('#input-job_type').on('change', () => {
    Processes.disableFields($('#input-job_type').val());
});

/**
 * Tower selected, so select
 * appropriate zone.
 */
$('#input-job_tower').on('change', () => {
    Processes.selectZone($('#input-job_tower option:selected')[0].value)
});

/**
 * Zone selected, set appropriate
 * tower options.
 */
$('#input-job_zone').on('change', () => {
    Processes.setTowerOptionsByZone($('#input-job_zone option:selected')[0].value);
});

/**
 * On radio type selection, set model options for selection.
 */
$('#input-radio_type').on('change', () => {
    Processes.setRadioTypeOptions($('#input-radio_type option:selected')[0].value);
});

/**
 * On customer status change, disable appropriate fields.
 */
$('#input-cst_status-new').on('change', () => {
    if($('#input-cst_status-new').is(':checked')) { // Fail safe
        Processes.disableFields('voip-new');
        $('#input-block-equipment-information').hide();
        $('#input-block-current-customer-information').hide();
        $('#input-block-new-customer-information').show();
    }
});

$('#input-cst_status-current').on('change', () => {
    if($('#input-cst_status-current').is(':checked')) { // Fail safe
        Processes.enableFields();
        $('#input-block-new-customer-information').hide();
        $('#input-block-current-customer-information').show();
        $('#input-block-equipment-information').show();
    }
});

/**
 * On number assignment status change,
 * disable appropriate fields.
 */
$('#input-voip_assignment-ported').on('change', () => {
    if($('#input-voip_assignment-ported').is(':checked')) { // Fail safe
        $('#input-cst_email').attr('disabled', false);
    }
});

$('#input-voip_assignment-new').on('change', () => {
    if($('#input-voip_assignment-new').is(':checked')) { // Fail safe
        $('#input-cst_email').attr('disabled', true).val('');
    }
});