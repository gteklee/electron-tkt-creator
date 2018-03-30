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
     *
     */
    this.Repair = new function()
    {
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
        this.getCustomer = function(id, name)
        {
            this.id = id;
            this.name = name;
            this.Sonar = require('../server/Sonar.js');

            this.Sonar.Customer.GetCustomer(this.id, this.name, sessionStorage.username, sessionStorage.password, (data) => {
                
            });
        }

        /**
         * Displays the empty ticket template form.
         */
        this.displayEmptyForm = function()
        {
            $('#input-customer-search').removeClass('input-block').addClass('input-block-hidden');
            $('#input-ticket-template').removeClass('input-block-hidden').addClass('input-block');
            $('#back-btn').removeClass('bbtn-container-hidden').addClass('bbtn-container');
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
         * Check the id on each key stroke.
         * @param {*} id 
         */
        this.checkId = function(id)
        {
            this.id = id;

            if(this.id.match(/^[a-zA-Z]/))
            {
                console.log("Error");
            }
        }

        /**
         * Check the id and name when check account
         * button is clicked.
         * @param {*} id 
         * @param {*} name 
         */
        this.checkIdName = function(id, name)
        {
            this.id = id;
            this.name = name;

            if(this.id == '' || this.name == '')
            {
                console.log('Error: ID and name cannot be empty!');
                return;
            }
            else
                this.getCustomer(this.id, this.name);

        }

        /**
         * When back button is clicked, take user
         * back to the customer information page.
         */
        this.back = function ()
        {
            $('#input-customer-search').removeClass('input-block-hidden').addClass('input-block');
            $('#input-ticket-template').removeClass('input-block').addClass('input-block-hidden');
            $('#back-btn').removeClass('bbtn-container').addClass('bbtn-container-hidden');
        }
    }

    this.Install = new function() {}
    this.Onsite = new function() {}
    this.Relo = new function() {}

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
$('#btn-repair-create-ticket').on('click', () => {
    Tickets.Repair.checkIdName($('#input-repair-customer-id'), $('#input-repair-customer-name'));
});

/**
 * "CREATE TICKET" button clicked event.
 */
$('#btn-repair-create-ticket').on('click', () => {
    Tickets.Repair.displayEmptyForm();
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