/**
 * Handle all error checking with all ticket forms.
 * Handle all field manipulation with all ticke forms.
 */

/** ALL LISTENERS 
$('#').on('', () => {

});*/

/** REPAIR TICKET 'on change' LISTENERS */

// --- SELECTIONS ---------------------------------------------------------------------------------
// Ticket type
$('#input-repair-tkt_type').on('change', () => {
    Forms.Repair.checkBlank($('#input-repair-tkt_type').val(), '#err-tkt_type');
    Forms.Repair.disableFields($('#input-repair-tkt_type').val());
});

// Nearest Tower
$('#input-repair-tkt_tower').on('change', () => {
    Forms.Repair.checkBlank($('#input-repair-tkt_tower').val(), '#err-tkt_tower');
});

// Zone
$('#input-repair-tkt_zone').on('change', () => {
    Forms.Repair.checkBlank($('#input-repair-tkt_zone').val(), '#err-tkt_zone');
});

// Radio type
$('#input-repair-radio_type').on('change', () => {
    Forms.Repair.checkBlank($('#input-repair-radio_type').val(), '#err-radio_type');
});
// -----------------------------------------------------------------------------------------------

// --- TEXT FIELDS -------------------------------------------------------------------------------
// Customer ID
$('#input-repair-customer_id').on('change', () => {
    Forms.Repair.checkBlank($('#input-repair-customer_id').val(), '#err-customer_id');
});

// Customer Name
$('#input-repair-customer_name').on('change', () => {
    Forms.Repair.checkBlank($('#input-repair-customer_name').val(), '#err-customer_name');
});

// Radio Management IP
$('#input-repair-radio_managed').on('change', () => {
    Forms.Repair.checkBlank($('#input-repair-radio_managed').val(), '#err-radio_managed');
});

// Radio Public IP
$('#input-repair-radio_public').on('change', () => {
    Forms.Repair.checkBlank($('#input-repair-radio_public').val(), '#err-radio_public');
});

// Radio MAC Address
$('#input-repair-radio_mac').on('change', () => {
    Forms.Repair.checkBlank($('#input-repair-radio_mac').val(), '#err-radio_mac');
});

// Radio Signal Strength
$('#input-repair-radio_signal').on('change', () => {
    Forms.Repair.checkBlank($('#input-repair-radio_signal').val(), '#err-radio_signal');
});
// -----------------------------------------------------------------------------------------------

/** REPAIR TICKET 'on key stroke' LISTENERS */

// --- TEXT FIELDS -------------------------------------------------------------------------------

// Customer ID
$('#input-repair-customer_id').keyup(event => {
    Forms.Repair.checkCharactersForNumeric($('#input-repair-customer_id').val(), '#err-customer_id');
});

// Customer Name
$('#input-repair-customer_name').keyup(event => {
    Forms.Repair.checkCharacters($('#input-repair-customer_name').val(), '#err-customer_name');
});

// Radio Managed IP
$('#input-repair-radio_managed').keyup(event => {
    Forms.Repair.checkCharactersForIp($('#input-repair-radio_managed').val(), '#err-radio_managed');
});

// Radio Public IP
$('#input-repair-radio_public').keyup(event => {
    Forms.Repair.checkCharactersForIp($('#input-repair-radio_public').val(), '#err-radio_public');
});

// Radio MAC Address
$('#input-repair-radio_mac').keyup(event => {
    Forms.Repair.checkCharactersForMac($('#input-repair-radio_mac').val(), '#err-radio_mac');
});
// -----------------------------------------------------------------------------------------------

/**
 * Forms object contains objects for each ticket that
 * handles any checks or display of errors to the user
 * for the specified ticket.
 */
let Forms = new function()
{
    this.errors = [];   // Array of errors.
    this.error = false; // Is there an error?

    this.invalidChars = ['~', '!', '@', '#', '$', '^', '%', '*', '=', '+', '<', '>', '?', '|', '`']; // Non-valid chars for input.

    /**
     * Repair Ticket Forms
     */
/**/this.Repair = new function()
    {
        // Check if selection is blank.
        this.checkBlank = function(val, id)
        {
            if(val == 0) // Can't be blank.
            {
                // Error displayed.
                Forms.error = true;
                Forms.errors.push(id);
                Forms.DisplayError(id, 'Field cannot be blank!');
            }
            else
                Forms.ResetError(id);

            console.log(Forms.errors);
        }

        // Check for invalid characters in numeric fields.
        this.checkCharactersForNumeric = function(val, id)
        {
            for(let i = 0; i < val.length; i++)
            {
                if(val[i].match(/^[`~!@#$%^&*()_|+\-=?;:'",.<>a-zA-Z]/))
                {
                    Forms.error = true;
                    Forms.errors.push(id);
                    Forms.DisplayError(id, 'Field contains invalid characters!');
                    break;
                }
                else if(val[i].match(' '))
                {
                    Forms.error = true;
                    Forms.errors.push(id);
                    Forms.DisplayError(id, 'Field contains whitespace!');
                    break;
                }

                Forms.ResetError(id);
            }
        }

        // Check for invalid characters in any field.
        this.checkCharacters = function(val, id)
        {
            for(let i = 0; i < val.length; i++)
            {
                if(val[i].match(/^[`~!@#$%^&*()_|+\-=?;:'",.<>]/))
                {
                    Forms.error = true;
                    Forms.errors.push(id);
                    Forms.DisplayError(id, 'Field contains invalid characters!');
                    break;
                }

                Forms.ResetError(id);
            }
        }

        // Check for invalid characters for ip fields.
        this.checkCharactersForIp = function(val, id)
        {
            for(let i = 0; i < val.length; i++)
            {
                if(val[i].match(/^[`~!@#$%^&*()_|+\-=?;:'",<>a-zA-Z]/))
                {
                    Forms.error = true;
                    Forms.errors.push(id);
                    Forms.DisplayError(id, 'Field contains invalid characters!');
                    break;
                }
                else if(val[i].match(' '))
                {
                    Forms.error = true;
                    Forms.errors.push(id);
                    Forms.DisplayError(id, 'Field contains whitespace!');
                    break;
                }

                Forms.ResetError(id);
            }
        }

        // Check for invalid characters for mac fields.
        this.checkCharactersForMac = function(val, id)
        {
            for(let i = 0; i < val.length; i++)
            {
                if(val[i].match(/^[`~!@#$%^&*()_|+\-=?;'",<>]/))
                {
                    Forms.error = true;
                    Forms.errors.push(id);
                    Forms.DisplayError(id, 'Field contains invalid characters!');
                    break;
                }
                else if(val[i].match(' '))
                {
                    Forms.error = true;
                    Forms.errors.push(id);
                    Forms.DisplayError(id, 'Field contains whitespace!');
                    break;
                }

                Forms.ResetError(id);
            }
        }

        // Disable appropriate fields based on value selected
        // in job type.
        this.disableFields = function(val)
        {
            // Re-enable all possibly disabled fields.
            $('#input-repair-cst_speed-test').prop('disabled', false);   // Disable cst_speed-test
            $('#input-repair-cst_torch').prop('disabled', false);        // Disable cst_torch
            $('#input-repair-radio_speed-test').prop('disabled', false); // Disable radio_speed-test
            $('#input-repair-radio_ap_count').prop('disabled', false);   // Disable radio_ap_count
            $('#input-repair-radio_ccq').prop('disabled', false);        // Disable radio_ccq
            $('#input-repair-radio_qual').prop('disabled', false);       // Disable radio_qual
            $('#input-repair-radio_signal').prop('disabled', false);     // Disable radio_signal

            if(val == 1) // Radio Down.
            {
                $('#input-repair-cst_speed-test').prop('disabled', true);   // Disable cst_speed-test
                $('#input-repair-cst_torch').prop('disabled', true);        // Disable cst_torch
                $('#input-repair-radio_speed-test').prop('disabled', true); // Disable radio_speed-test
                $('#input-repair-radio_ap_count').prop('disabled', true);   // Disable radio_ap_count
                $('#input-repair-radio_ccq').prop('disabled', true);        // Disable radio_ccq
                $('#input-repair-radio_qual').prop('disabled', true);       // Disable radio_qual
                $('#input-repair-radio_signal').prop('disabled', true);     // Disable radio_signal
            }
            else if(val == 2) // No Connection
            {
                $('#input-repair-cst_speed-test').prop('disabled', true);   // Disable cst_speed-test
                $('#input-repair-radio_speed-test').prop('disabled', true); // Disable radio_speed-test
            }
            else if(val == 5) // Intermittent Connection
            {
                $('#input-repair-cst_speed-test').prop('disabled', true); // Disable cst_speed-test
            }
            else if(val == 6) // Conversion
            {
                $('#input-repair-cst_speed-test').prop('disabled', true);   // Disable cst_speed-test
                $('#input-repair-radio_speed-test').prop('disabled', true); // Disable radio_speed-test
            }
        }
    }

    /**
     * Displays error message given id. 
     */
/**/this.DisplayError = function(id, err)
    {
        if(this.error)
            $(id).text(err);
    }

    /**
     * Resets specified error message given id.
     */
/**/this.ResetError = function(id)
    {
        // Remove element from array of errors based on value.
        if(this.errors.includes(id))
            for(let i = 0; i < this.errors.length; i++)
                if(this.errors[i] == id)
                    this.errors.splice(i, 1);

        if(this.errors.length < 1) // Check if there are still errors.
            this.error = false;
        
        $(id).text('');
    }
}



