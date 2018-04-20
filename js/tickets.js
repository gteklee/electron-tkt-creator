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
    this.Towers = require('../js/modules/Towers.js'); // Get the Towers module.
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
            acct: null,

            tkt_type:   '',
            tkt_tower:  '',
            tkt_zone:   '',
            tkt_notes:  '',

            customer_id:    '',
            customer_name:  '',
            cst_package:    [],
            cst_speedtest:  '',
            cst_torch:      '',

            radio_managed:      '',
            radio_public:       '',
            radio_mac:          '',
            radio_speedtest:    '',
            radio_type:         '',
            radio_type_type:    '',
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

            // Set name and id.

            /** IP assignments */
            this.Sonar.Customer.GetIPAssignments(this.account.id, sessionStorage.username, sessionStorage.password, (data) => {
                console.log(data);
                // Get all ip assignments as long as ips are assigned.
                if(data.data.length > 0)
                {
                    let managed_inventory_id; // Inventory item.

                    // Get managed ip, public ip, and radio type.
                    for(let i = 0; i < data.data.length; i++)
                    {
                        let assignment = data.data[i];  // Ip assignment pulled from Sonar.

                        // Determine ips.
                        if(assignment.subnet.indexOf('10.1.') > -1) { this.TicketData.radio_managed = assignment.subnet; this.TicketData.radio_type = 'UBNT'; managed_inventory_id = assignment.assigned_id; } // Radio
                        else if(assignment.subnet.indexOf('10.130.')  > -1) { this.TicketData.radio_managed = assignment.subnet; this.TicketData.radio_type = 'Canopy'; managed_inventory_id = assignment.assigned_id; } // Radio
                        else if(assignment.subnet.indexOf('10.150.')  > -1) { this.TicketData.radio_managed = assignment.subnet; this.TicketData.radio_type = 'ePMP'; managed_inventory_id = assignment.assigned_id; } // Radio
                        else if(assignment.subnet.indexOf('65.91.199.')  > -1 || assignment.subnet.indexOf('65.91.198.')  > -1) { this.TicketData.radio_managed = assignment.subnet; this.TicketData.radio_type = 'Telrad'; managed_inventory_id = assignment.assigned_id; } // Radio
                        else if(assignment.subnet.indexOf('65.91.196.' > -1) || assignment.subnet.indexOf('65.91.197.') > -1) { this.TicketData.radio_public = assignment.subnet; } // Static
                        else if(assignment.subnet.indexOf('8.24.')  > -1)  { this.TicketData.radio_public = assignment.subnet; }  // Static
                        else if(assignment.subnet.indexOf('50.93.')  > -1) { this.TicketData.radio_public = assignment.subnet; }  // Static
                        else if(assignment.subnet.indexOf('65.90.')  > -1) { this.TicketData.radio_public = assignment.subnet; }  // Static
                        else if(assignment.subnet.indexOf('172.20.')  > -1) { this.TicketData.radio_public = assignment.subnet; } // Static
                    }

                    // Get MAC address by using assignment id of inventory item.
                    this.Sonar.Customer.GetInventoryItem(managed_inventory_id, sessionStorage.username, sessionStorage.password, (obj) => {
                        
                        // Check each field in the inventory items.
                        if(!obj.error)
                        {
                            for(let i = 0; i < obj.data.fields.length; i++)
                            {
                                let field = obj.data.fields[i]; // Get current element.

                                if(field.data == '') // If field is blank, go to next element.
                                    continue;

                                if(field.data.length == 17) // Got MAC address.
                                    this.TicketData.radio_mac = field.data;
                            }
                            this.getServices();
                        }
                    });
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
                console.log(_.cst_package[0] + ' ' + _.cst_package[1]);
                console.log(_.radio_type + ': ' + _.radio_managed);
                console.log(_.radio_mac);
                console.log(_.radio_public);

                this.clearTicket();

                // Fill out the appropriate values.
                if(_.customer_id != '') $('#input-repair-customer_id').val(_.customer_id);        // Customer ID.
                if(_.customer_name != '') $('#input-repair-customer_name').val(_.customer_name);  // Customer Name.
                if(_.radio_managed != '') $('#input-repair-radio_managed').val(_.radio_managed); // Radio managed IP.
                if(_.radio_public != '') $('#input-repair-radio_public').val(_.radio_public);    // Public IP.
                if(_.radio_mac != '') $('#input-repair-radio_mac').val(_.radio_mac);             // Radio MAC.
                if(_.radio_type != '') { $('#input-repair-radio_type').val(_.radio_type.toUpperCase()).change(); }
                // Package radio buttons.
                if(_.cst_package.length > 0)
                {
                    $('input[type=radio][name=package][value=' + _.cst_package[0] + ']').prop('checked', true).change();
                    $('#input-repair-cst_package').val(_.cst_package[1]);
                }

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
                            continue;

                        // Determine package.
                        if(service.id >= 1 && service.id <= 5) // Res
                        {
                            this.TicketData.cst_package[0] = 'Residential';

                            // Check type of package.
                            if(service.id == 1) this.TicketData.cst_package[1] = 'Steel';
                            else if(service.id == 2) this.TicketData.cst_package[1] = 'Bronze';
                            else if(service.id == 3) this.TicketData.cst_package[1] = 'Silver';
                            else if(service.id == 4) this.TicketData.cst_package[1] = 'Gold';
                            else if(service.id == 5) this.TicketData.cst_package[1] = 'Platinum';
                        }
                        else if(service.id >= 6 && service.id <= 10) // Bus
                        {
                            this.TicketData.cst_package[0] = 'Business';

                            // Check type of package.
                            if(service.id == 6) this.TicketData.cst_package[1] = 'Steel';
                            else if(service.id == 7) this.TicketData.cst_package[1] = 'Bronze';
                            else if(service.id == 8) this.TicketData.cst_package[1] = 'Silver';
                            else if(service.id == 9) this.TicketData.cst_package[1] = 'Gold';
                            else if(service.id == 10) this.TicketData.cst_package[1] = 'Platinum';
                        }
                        else if(service.id >= 64 && service.id <= 79) // PTP
                        {
                            this.TicketData.cst_package[0] = 'Other';
                            this.TicketData.cst_package[1] = 'Point-To-Point';
                        }
                        else if(service.id == 95) // Trade
                        {
                            this.TicketData.cst_package[0] = 'Other';
                            this.TicketData.cst_package[1] = 'Trade Agreement';
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
            if($('#input-repair-tkt_type').val() == 1) _.tkt_type = 'Radio Down';
            else if($('#input-repair-tkt_type').val() == 2) _.tkt_type = 'No Connection';
            else if($('#input-repair-tkt_type').val() == 3) _.tkt_type = 'Intermittent Connection';
            else if($('#input-repair-tkt_type').val() == 4) _.tkt_type = 'Slow / Intermittent Speeds';
            else if($('#input-repair-tkt_type').val() == 5) _.tkt_type = 'Poor Signal';
            else if($('#input-repair-tkt_type').val() == 6) _.tkt_type = 'Conversion';
            else if($('#input-repair-tkt_type').val() == 7) _.tkt_type = 'Onsite';
            else if($('#input-repair-tkt_type').val() == 8) _.tkt_type = 'Misc.';

            _.tkt_tower = $('#input-repair-tkt_tower').val();
            _.tkt_zone = $('#input-repair-tkt_zone').val();
            _.tkt_notes = $('#input-repair-tkt_notes').val();

            if(_.customer_id == '')
                _.customer_id = $('#input-repair-customer_id').val();
             
            if(_.customer_name == '')
                _.customer_name = $('#input-repair-customer_name').val();

            if(_.cst_package.length < 1)
            {
                _.cst_package.push($('input[type=radio][name=package]:checked').val());
                _.cst_package.push($('#input-repair-cst_package').val());
            }

            _.cst_speedtest = $('#input-repair-cst_speedtest').val();
            _.cst_torch = $('#input-repair-cst_torch').val();

            if(_.radio_managed == '')
                _.radio_managed = $('#input-repair-radio_managed').val();

            if(_.radio_public == '')
                _.radio_public = $('#input-repair-radio_public').val();

            if(_.radio_mac == '')
                _.radio_mac = $('#input-repair-radio_mac').val();

            _.radio_speedtest = $('#input-repair-radio_speedtest').val();

            if(_.radio_type == '')
                _.radio_type = $('#input-repair-radio_type').val();

            _.radio_type_type = $('#input-repair-radio_type_type').val();
            _.radio_signal = $('#input-repair-radio_signal').val();
            _.radio_last_signal = $('#input-repair-radio_last_signal').val();
            _.radio_ccq = $('#input-repair-radio_ccq').val();
            _.radio_qual = $('#input-repair-radio_qual').val();
            _.radio_ssid = $('#input-repair-radio_ssid').val();
            _.radio_ap_count = $('#input-repair-radio_ap_count').val();

            // Create string template.
            let template = 'Job Type: ' + _.tkt_type + '\r\r';
            template += _.customer_name + '\r';
            template += _.cst_package[0] + ' ' + _.cst_package[1] + '\n\n';
            template += 'Tower: ' + _.tkt_tower + '\r';
            template += 'Zone: ' + _.tkt_zone + '\r\r';
            template += 'Managed IP:   ' + _.radio_managed + '\r';
            template += 'Public IP:    ' + _.radio_public + '\r';
            template += 'MAC Address:  ' + _.radio_mac + '\r';
            template += 'Radio Type:   ' + _.radio_type + ' ' + _.radio_type_type + '\r';
            if(_.radio_ssid != '')
                template += 'SSID:         ' + _.radio_ssid + '\r';

            if(_.radio_ap_count != '')
                template += 'AP CST Count: ' + _.radio_ap_count + '\r';

            if(_.radio_ccq != '')    
                template += 'CCQ:          ' + _.radio_ccq + '\r';
            
            if(_.radio_qual != '')
                template += 'Qual / Cap:   ' + _.radio_qual + '\r';
            
            if(_.radio_signal != '')
                template += 'Radio Signal: ' + _.radio_signal + '\r';

            if(_.radio_last_signal != '')
                template += 'Last Known Good Signal: ' + _.radio_last_signal + '\r';
            
            if(_.radio_speedtest != '')
                template += 'Radio Speed Test: ' + _.radio_speedtest + '\r\r';
            
            if(_.cst_torch != '')
                template += 'Torch Results: ' + _.cst_torch + '\r';

            if(_.cst_speedtest != '')
                template += 'CST Speed Test Results: ' + _.cst_speedtest + '\r';

            //console.log(_);
            //console.log(template);
            this.Sonar.Ticket.Submit(_.customer_id, template, sessionStorage.username, sessionStorage.password, (data) => {
                console.log(data);
                $('#succ-submit').text('Ticket Submitted!');
            });

        }

        /**
         * Clear all repair ticket form fields.
         */
        this.clearTicketForm = function()
        {
            $('#input-repair-tkt_type').val('').change();
            $('#input-repair-tkt_tower').val('');
            $('#input-repair-tkt_zone').val('');
            $('#input-repair-tkt_notes').val('');

            $('#input-repair-customer_id').val('');
            $('#input-repair-customer_name').val('');
            $('input[type=radio][name=package][value="Residential"]').prop('checked', false).change();
            $('input[type=radio][name=package][value="Business"]').prop('checked', false).change();
            $('input[type=radio][name=package][value="Other"]').prop('checked', false).change();
            $('#input-repair-cst_speedtest').val('');
            $('#input-repair-cst_torch').val('');

            $('#input-repair-radio_managed').val('');
            $('#input-repair-radio_public').val('');
            $('#input-repair-radio_mac').val('');
            $('#input-repair-radio_speedtest').val('');
            $('#input-repair-radio_type').val('');
            $('#input-repair-radio_type_type').val('');
            $('#input-repair-radio_signal').val('');
            $('#input-repair-radio_last_signal').val('');
            $('#input-repair-radio_ccq').val('');
            $('#input-repair-radio_qual').val('');
            $('#input-repair-radio_ssid').val('');
            $('#input-repair-radio_ap_count').val('');
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
            _.cst_package = [];
            _.radio_managed = '';
            _.radio_public = '';
            _.radio_mac = '';
            _.radio_type = '';
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
         * Displays the continue to ticket section.
         */
        this.displayContinueToTicket = function()
        {
            $(this.currentSection).removeClass('input-block').addClass('input-block-hidden');
            $('#input-customer-continue').removeClass('input-block-hidden').addClass('input-block');
            this.currentSection = '#input-customer-continue';
        }

        /**
         * Displays the empty ticket template form.
         */
        this.displayForm = function()
        {
            $(this.currentSection).removeClass('input-block').addClass('input-block-hidden');
            $('#input-ticket-template').removeClass('input-block-hidden').addClass('input-block');
            $('#input-ticket-submit').removeClass('input-block-hidden').addClass('input-block');
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
         * Set the zone selected based on the tower selected.
         */
        this.selectZone = function()
        {
            this.tower = $('#input-repair-tkt_tower option:selected')[0].value; // Get tower name.
            let zone = Tickets.Towers.getZone(this.tower);  // Get zone of selected tower based on name.
            console.log(this.tower);
            console.log(zone);

            // Select received zone value.
            $('#input-repair-tkt_zone').val(zone);
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
            $('#input-repair-cst_package').find('option').remove();

            // Add appropriate options.
            if($('#input-cst_package-residential').is(':checked') || $('#input-cst_package-business').is(':checked'))
            {
                for(let i = 0; i < Tickets.Package.Default.length; i++)
                {
                    $('#input-repair-cst_package').append($('<option>', {
                        value: Tickets.Package.Default[i].Value,
                        text: Tickets.Package.Default[i].Text
                    }));
                }
            }
            else if($('#input-cst_package-other').is(':checked'))
            {
                for(let i = 0; i < Tickets.Package.Other.length; i++)
                {
                    $('#input-repair-cst_package').append($('<option>', {
                        value: Tickets.Package.Other[i].Value,
                        text: Tickets.Package.Other[i].Text
                    }));
                }
            }
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
    Tickets.Repair.displayForm();
});

/**
 * "DENY" button clicked event.
 */
$('#btn-repair-customer-deny').on('click', () => {
    Tickets.Repair.back();
});

/**
 * "CONFIRM" button clicked event.
 */
$('#btn-repair-customer-confirm').on('click', () => {
    Tickets.Repair.fillTicketForm();
});

/**
 * "CONTINUE" button clicked event.
 */
$('#btn-repair-customer-continue').on('click', () => {
    Tickets.Repair.fillTicketForm();
});

/**
 * "CLEAR" button clicked event.
 */
$('#btn-repair-tkt-clear').on('click', () => {
    Tickets.Repair.clearTicketForm();
});

/**
 * "SUBMIT" button clicked event.
 */
$('#btn-repair-tkt-submit').on('click', () => {
    Tickets.Repair.submitTicketForm();
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
 * Tower on selection event.
 */
$('#input-repair-tkt_tower').on('change', () => {
    Tickets.Repair.selectZone();
});

/**
 * Back Button clicked event.
 */
$('#back-btn-icon').on('click', () => {
    Tickets.Repair.back();
});