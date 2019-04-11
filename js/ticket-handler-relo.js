const Processes = require('./modules/Processes-test.js'); // All common processes with the form.
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

            job_address_disco:  '',
            job_city_disco:     '',
            job_zone:           '',

            job_address_inst:   '',
            job_city_inst:      '',
            job_tower:          '',

            job_time:   '',
            tkt_notes:  '',

            tkt_type: 'relo'
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
            {   // Loop through each field and clear it
                for(let i = 0; i < this.input_ids.length; i++) {
                    $('#input-' + this.input_ids[i]).val('');

                    if(this.input_ids[i] === 'cst_contract') { // Clear second radio
                        $('#input-cst_contract_price').val(''); // type field
                    }
                }
                Processes.createTowerOptions();
            },

            /**
             * Fill the ticket with customer data
             * pulled from Sonar.
             */
            fill: function()
            {   // Set values of the data in the ticket form
                this.clear();
                for(let i = 0; i < this.input_ids.length; i++) {
                    if(this.input_ids[i] === 'cst_package') { // Set customer package
                        $('input[type=radio][name=package][value=' + this.that.getTicketDataProperty(this.input_ids[i])[0] + ']').prop('checked', true).change();
                        $('#input-cst_package').val(this.that.getTicketDataProperty(this.input_ids[i])[1]);
                    } 
                    else {
                        $('#input-' + this.input_ids[i]).val(this.that.getTicketDataProperty(this.input_ids[i]));
                    }
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
                    } // Customer package field
                    else if(prop === 'cst_package') {
                        let package = [];
                        if($('#input-cst_package-residential').is(':checked')) {
                            package[0] = 'Residential';
                        } else if($('#input-cst_package-business').is(':checked')) {
                            package[0] = 'Business';
                        } else if($('#input-cst_package-other').is(':checked')) {
                            package[0] = 'Other';
                        } else {
                            console.error('Unable to set property: ' + prop);
                        }
                        package[1] = $('#input-cst_package').val();
                        this.that.setTicketDataProperty(prop, package);
                    } // Customer contract
                    else if(prop === 'cst_contract') {
                        let contract = [];
                        contract[0] = $('#input-cst_contract').val();
                        contract[1] = $('#input-cst_contract_price').val();
                        this.that.setTicketDataProperty(prop, contract);
                    } // Normal field
                    else {
                        this.that.setTicketDataProperty(prop, $('#input-' + prop).val());
                    }
                }
                console.log(this.that.getTicketData());
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
            console.log(data);
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
 * Tower selected, so select
 * appropriate zone.
 */
// $('#input-job_tower').on('change', () => {
//     Processes.selectZone($('#input-job_tower option:selected')[0].value);
// });

// /**
//  * Zone selected, set appropriate
//  * tower options.
//  */
// $('#input-job_zone').on('change', () => {
//     Processes.setTowerOptions($('#input-job_zone option:selected')[0].value, (tower) => {
//         $('#input-job_tower').val(tower);
//     });
// });

/**
 * On radio type selection, set model options for selection.
 */
$('#input-radio_type').on('change', () => {
    Processes.setRadioTypeOptions($('#input-radio_type option:selected')[0].value);
});

/**
 * On service package radio button checked.
 */
$('input[type=radio][name=package]').change(event => {
    Processes.setServicePackageOptions();
});

// Due to no customer search
$(window).on('load', () => {
    Tickets.Handler.form.clear();
});