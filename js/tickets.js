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
            cst_tower_height: '',
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
                        else
                        {
                            console.log(obj);
                            this.getServices(); // Move on if there was an error getting Inventory Items
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

            _.customer_id = $('#input-repair-customer_id').val(); 
            _.customer_name = $('#input-repair-customer_name').val();

            _.cst_package = []; // Clear array before pushing again.
            _.cst_package.push($('input[type=radio][name=package]:checked').val());
            _.cst_package.push($('#input-repair-cst_package').val());

            _.cst_tower_height = $('input[type=radio][name=height]:checked').val();

            _.cst_speedtest = $('#input-repair-cst_speedtest').val();
            _.cst_torch = $('#input-repair-cst_torch').val();

            _.radio_managed = $('#input-repair-radio_managed').val();

            _.radio_public = $('#input-repair-radio_public').val();

            _.radio_mac = $('#input-repair-radio_mac').val();

            _.radio_speedtest = $('#input-repair-radio_speedtest').val();

            _.radio_type = $('#input-repair-radio_type').val();

            _.radio_type_type = $('#input-repair-radio_type_type').val();
            _.radio_signal = $('#input-repair-radio_signal').val();
            _.radio_last_signal = $('#input-repair-radio_last_signal').val();
            _.radio_ccq = $('#input-repair-radio_ccq').val();
            _.radio_qual = $('#input-repair-radio_qual').val();
            _.radio_ssid = $('#input-repair-radio_ssid').val();
            _.radio_ap_count = $('#input-repair-radio_ap_count').val();

            // Create string template.
            let template = '<p>Job Type: ' + _.tkt_type + '</p>';
            template += '<p>' + _.customer_name + '<br>';
            template += _.cst_package[0] + ' ' + _.cst_package[1] + '</p>';
            template += '<p>Tower: ' + _.tkt_tower + '<br>';
            template += 'Zone: ' + _.tkt_zone + '</p>';
            template += '<p>Managed IP:   ' + _.radio_managed + '<br>';
            template += 'Public IP:    ' + _.radio_public + '<br>';
            template += 'MAC Address:  ' + _.radio_mac + '<br>';
            template += 'Radio Type:   ' + _.radio_type + ' ' + _.radio_type_type + '<br>';
            if(_.radio_ssid != '')
                template += 'SSID:         ' + _.radio_ssid + '<br>';

            if(_.radio_ap_count != '')
                template += 'AP CST Count: ' + _.radio_ap_count + '<br>';

            if(_.radio_ccq != '')    
                template += 'CCQ:          ' + _.radio_ccq + '<br>';
            
            if(_.radio_qual != '')
                template += 'Qual / Cap:   ' + _.radio_qual + '<br>';
            
            if(_.radio_signal != '')
                template += 'Radio Signal: ' + _.radio_signal + '<br>';

            if(_.radio_last_signal != '')
                template += 'Last Known Good Signal: ' + _.radio_last_signal + '<br>';
            
            if(_.radio_speedtest != '')
                template += 'Radio Speed Test: ' + _.radio_speedtest + '</p>';
            
            if(_.cst_torch != '')
                template += '<p>Torch Results: ' + _.cst_torch + '<br>';
            else
                template += '<p>';

            if(_.cst_speedtest != '')
                template += 'CST Speed Test Results: ' + _.cst_speedtest + '</p>';
            else
                template += '</p>';

            if(_.tkt_notes != '')
                template += '<p>Notes: ' + _.tkt_notes + '</p>';

            //console.log(_);
            //console.log(template);
            this.Sonar.Ticket.Submit(_.customer_id, template, sessionStorage.username, sessionStorage.password, (data) => {

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

                // Update custom fields
                this.Sonar.Ticket.UpdateCustomFields(_, data, sessionStorage.username, sessionStorage.password, (dataCustom) => {
                    
                    if(dataCustom.error)
                    {
                        console.log(dataCustom);
                        $('#succ-submit').removeClass('success-msg').addClass('err-msg');
                        $('#succ-submit').text('Error updating custom field - Job still created!');

                        $('#succ-submit').fadeIn();
                        window.setTimeout(() => {$('#succ-submit').fadeOut('slow')}, 10000);
                        return;
                    }
                    else
                    {
                        console.log(dataCustom);
                    }

                });
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
            $('input[type=radio][name=height][value="Yes"]').prop('checked', false).change();
            $('input[type=radio][name=height][value="No"]').prop('checked', false).change()
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
         * Alert the user they clicked clear.
         */
        this.alertClear = function()
        {
            $('.alert-blur').show();
            $('#alert-block-clear').removeClass('alert-block-hidden');
            $('#alert-block-clear').addClass('alert-block');
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
         * Cancel clear of ticket.
         */
        this.alertClearClose = function()
        {
            $('#alert-block-clear').removeClass('alert-block');
            $('#alert-block-clear').addClass('alert-block-hidden');
            $('.alert-blur').hide();
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
            let tower = $('#input-repair-tkt_tower option:selected')[0].value; // Get tower name.
            let zone = Tickets.Towers.getZone(tower);  // Get zone of selected tower based on name.
            console.log(tower);
            console.log(zone);

            // Select received zone value.
            $('#input-repair-tkt_zone').val(zone);
        }

        /**
         * Set the tower options based on the zone selected.
         */
        this.setTowerOptions = function()
        {
            let zone = $('#input-repair-tkt_zone option:selected')[0].value; // Get zone selected.
            let zoneTowers = [];
            let allTowers = Tickets.Towers.towers;

            $('#input-repair-tkt_tower').children().remove(); // Remove all options from dropdown.

            if(zone == 0) Tickets.Towers.createOptions();
            else 
            {
                for(let i = 0; i < allTowers.length; i++)
                {
                    if(zone == Tickets.Towers.getZone(allTowers[i].name))
                    {
                        $('#input-repair-tkt_tower').append($('<option>', {
                            value: allTowers[i].name,
                            text: allTowers[i].name
                        }));
                    }
                }
            }
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
            location.reload();
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

$('#input-repair-customer-id').keypress((e) => {
    if(e.keyCode === 13 && $('#input-repair-customer-id').val() != '') // Enter key
        $('#btn-repair-customer-check').click();
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
    Tickets.Repair.clearTicketForm();
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
    Tickets.Repair.alertClear();
    //Tickets.Repair.clearTicketForm();
});
    // Alert box with buttons when clear button is clicked above.
    /**
     * "CLEAR" confirm button clicked event.
     */
    $('#btn-clear-confirmation-clear').on('click', () => {
        Tickets.Repair.alertClearClose();
        Tickets.Repair.clearTicketForm();
    });

    /**
     * "CANCEL" button clicked event.
     */
    $('#btn-clear-confirmation-cancel').on('click', () => {
        Tickets.Repair.alertClearClose();
    });

/**
 * "SUBMIT" button clicked event.
 */
$('#btn-repair-tkt-submit').on('click', () => {
    Tickets.Repair.alertSubmit();
    //Tickets.Repair.submitTicketForm();
});
    // Alert box with buttons when submit button is clicked above.
    /**
     * "SUBMIT" confirm button clicked event.
     */
    $('#btn-submit-confirmation-submit').on('click', () => {
        Tickets.Repair.alertSubmitClose();
        Tickets.Repair.submitTicketForm();
    });

    /**
     * "CANCEL" button clicked event.
     */
    $('#btn-submit-confirmation-cancel').on('click', () => {
        Tickets.Repair.alertSubmitClose();
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
 * Zone on selection event.
 */
$('#input-repair-tkt_zone').on('change', () => {
    Tickets.Repair.setTowerOptions();
});

/**
 * Back Button clicked event.
 */
$('#back-btn-icon').on('click', () => {
    Tickets.Repair.back();
});