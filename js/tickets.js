/**
 * Tickets Object. Each function relative to each ticket page
 * is stored in this object. Listeners then use the
 * tickets object to make appropriate function calls.
 * 
 * Functions:
 * 
 * Repair() :: void
 * Install() :: void
 * Onsite() :: void
 * Relo() :: void
 */
let Tickets = new function()
{
    /**
     * Repair deals with all functions of the repair
     * ticket process.
     * 
     * getCustomer(id)
     * confirmAccountFound(obj)
     * 
     */
/**/this.Repair = new function()
    {
        this.error = false;
        this.errorMsg = '';
        this.currentSection = '#input-customer-search';

        /**
         * All data needed when the repair ticket
         * form is submitted.
         */
        this.TicketData = {
            tkt_type:   '',
            tkt_tower:  '',
            tkt_zone:   '',
            tkt_notes:  '',

            cst_id:         '',
            cst_name:       '',
            cst_package:    '',
            cst_speedtest:  '',
            cst_torch:      '',

            radio_managed:      '',
            radio_public:       '',
            radio_mac:          '',
            radio_speedtest:    '',
            radio_type:         '',
            radio_signal:       '',
            radio_last_signal:  '',
            radio_ccq:          '',
            radio_qual:         '',
            radio_ssid:         '',
            radio_ap_count:     ''
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

                    if(data.error.status_code == 404)
                        this.errorMsg = 'Customer ID does not exist!';
                    else
                        this.errorMsg = 'Inform Admin of Error Code ' + data.error.status_code + '!';

                    this.displayError('#err-cst_id');
                }
                else
                {
                    console.log(data);
                    this.confirmAccountFound(data);
                }
            });
        }

        /**
         * Takes the data returned when an account is found
         * with the provided id and then presents the user
         * to make sure the correct acount was pulled.
         * @param {*} obj
         */
        this.confirmAccountFound = function(obj)
        {
            this.object = obj;  // Object passed.

            // Set the appropriate text to user.
            // Name of customer is pulled from object retreived from Sonar.
            $('#info-confirm-cst_id').text('Account Found: ' + this.object.data.name);

            this.displayAccountConfirmation();  // Display account confirmation section.
        }

        /**
         * Displays the account confirmation section.
         */
        this.displayAccountConfirmation = function()
        {
            $('#input-customer-search').removeClass('input-block').addClass('input-block-hidden');
            $('#input-customer-confirm').removeClass('input-block-hidden').addClass('input-block');
            //$('#back-btn').removeClass('bbtn-container-hidden').addClass('bbtn-container');
            this.currentSection = '#input-customer-confirm';
        }

        /**
         * Displays the empty ticket template form.
         */
        this.displayEmptyForm = function()
        {
            $('#input-customer-search').removeClass('input-block').addClass('input-block-hidden');
            $('#input-ticket-template').removeClass('input-block-hidden').addClass('input-block');
            $('#back-btn').removeClass('bbtn-container-hidden').addClass('bbtn-container');
            this.currentSection = '#input-ticket-template';
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
         * Set the radio type options.
         */
        this.setRadioTypeOptions = function()
        {
            // Get value selected.
            this.value = $('#input-repair-radio_type option:selected')[0].value;

            // Get radios module for types.
            this.Radios = require('../js/modules/Radios.js');
            
            // Remove all options.
            $('#input-repair-radio_type_type').find('option').remove();

            // Set appropriate options.
            if(this.value === "UBNT")
            {
                for(let i = 0; i < this.Radios.UBNT.length; i++)
                {
                    $('#input-repair-radio_type_type').append($('<option>', {
                        value: this.Radios.UBNT[i],
                        text: this.Radios.UBNT[i]
                    }));
                }
            }
            else if(this.value === "CANOPY")
            {
                for(let i = 0; i < this.Radios.CANOPY.length; i++)
                {
                    $('#input-repair-radio_type_type').append($('<option>', {
                        value: this.Radios.CANOPY[i],
                        text: this.Radios.CANOPY[i]
                    }));
                }
            }
            else if(this.value === "TELRAD")
            {
                for(let i = 0; i < this.Radios.TELRAD.length; i++)
                {
                    $('#input-repair-radio_type_type').append($('<option>', {
                        value: this.Radios.TELRAD[i],
                        text: this.Radios.TELRAD[i]
                    }));
                }
            }
            else
                console.log('ERROR: "Radio type selected event": ticket.js')

        }

        /**
         * Set the service package options.
         */
        this.setServicePackageOptions = function()
        {
            // Remove all options.
            $('#input-repair-package').find('option').remove();

            // Add appropriate options.
            if($('#input-cst_package-residential').is(':checked') || $('#input-cst_package-business').is(':checked'))
            {
                for(let i = 0; i < Tickets.Package.Default.length; i++)
                {
                    $('#input-repair-package').append($('<option>', {
                        value: Tickets.Package.Default[i].Value,
                        text: Tickets.Package.Default[i].Text
                    }));
                }
            }
            else if($('#input-cst_package-other').is(':checked'))
            {
                for(let i = 0; i < Tickets.Package.Other.length; i++)
                {
                    $('#input-repair-package').append($('<option>', {
                        value: Tickets.Package.Other[i].Value,
                        text: Tickets.Package.Other[i].Text
                    }));
                }
            }
            else
                console.log('ERROR: "Radio button change event": ticket.js')
        }

        /**
         * Check the id per keystroke.
         * @param {*} id
         */
        this.checkId = function(id)
        {
            this.id = id;

            if(this.id.match(/^[a-zA-Z]/))
            {
                this.error = true;
                this.errorMsg = 'ID contains invalid characters!';
            }
            else
                this.resetError('#err-cst_id');

            if(this.error)
                this.displayError('#err-cst_id');
        }

        /**
         * Check if the ID is empty.
         * @param {*} id 
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
         * When back button is clicked, take user
         * back to the customer information page.
         */
        this.back = function()
        {
            $('#input-customer-search').removeClass('input-block-hidden').addClass('input-block');
            $(this.currentSection).removeClass('input-block').addClass('input-block-hidden');
            $('#back-btn').removeClass('bbtn-container').addClass('bbtn-container-hidden');
            this.currentSection = '#input-customer-search';
        }
    }

/**/this.Install = new function() {}
/**/this.Onsite = new function() {}
/**/this.Relo = new function() {}

    /**
     * Customer packages.
     */
    this.Package = {
        
        Default: [
            { Text: 'Steel',    Value: 'Steel'},
            { Text: 'Bronze',   Value: 'Bronze'},
            { Text: 'Silver',   Value: 'Silver'},
            { Text: 'Gold',     Value: 'Gold'},
            { Text: 'Platinum', Value: 'Platinum'}
        ],

        Other: [
            { Text: 'Trade Agreement', Value: 'Trade Agreement'},
            { Text: 'Point-To-Point',  Value: 'Point-To-Point'},
        ]
    }
}

/**
 * User typing in cutomer id listener.
 */
$('#input-repair-customer-id').keyup(() => {
    Tickets.Repair.checkId($('#input-repair-customer-id').val());
});

/**
 * "CHECK ACCOUNT" button clicked event.
 */
$('#btn-repair-customer-check').on('click', () => {
    Tickets.Repair.checkEmptyId($('#input-repair-customer-id').val());
});

/**
 * "CREATE TICKET" button clicked event.
 */
$('#btn-repair-create-ticket').on('click', () => {
    Tickets.Repair.displayEmptyForm();
});

/**
 * "DENY" button clicked event.
 */
$('#btn-repair-customer-deny').on('click', () => {
    Tickets.Repair.back();
});

/**
 * Service Package radio button changed event.
 */
$('input[type=radio][name=package]').change((event) => {
    Tickets.Repair.setServicePackageOptions();
});

/**
 * Radio Type on selection event.
 */
$('#input-repair-radio_type').on('change', () => {
    Tickets.Repair.setRadioTypeOptions();
});

/**
 * Back Button clicked event.
 */
$('#back-btn-icon').on('click', () => {
    Tickets.Repair.back();
});