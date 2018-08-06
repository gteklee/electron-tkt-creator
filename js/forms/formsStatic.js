$(() => {
    $('#btn-static-tkt-submit').prop('disabled', true);
    $('#err-submit').text('Important fields are blank!');
});

// --- TEXT FIELDS ---------------------------------------------------------------------------------
// Customer ID
$('#input-static-customer_id').on('change', () => {
    Forms.Static.checkBlank($('#input-static-customer_id').val(), '#err-customer_id');
    Forms.Static.checkSubmittable();
});
$('#input-static-customer_id').keyup(event => {
    Forms.Static.checkCharactersForNumeric($('#input-static-customer_id').val(), '#err-customer_id');
});

// Customer Name
$('#input-static-customer_name').on('change', () => {
    Forms.Static.checkBlank($('#input-static-customer_name').val(), '#err-customer_name');
    Forms.Static.checkSubmittable();
});
$('#input-static-customer_name').keyup(event => {
    Forms.Static.checkCharacters($('#input-static-customer_name').val(), '#err-customer_name');
});

// Radio Management IP
$('#input-static-radio_managed').on('change', () => {
    Forms.Static.checkBlank($('#input-static-radio_managed').val(), '#err-radio_managed');
    Forms.Static.checkSubmittable();
});
$('#input-static-radio_managed').keyup(event => {
    Forms.Static.checkCharactersForIp($('#input-static-radio_managed').val(), '#err-radio_managed');
});

// Router MAC Address
$('#input-static-router_mac').on('change', () => {
    Forms.Static.checkBlank($('#input-static-router_mac').val(), '#err-router_mac');
    Forms.Static.checkSubmittable();
});
$('#input-static-router_mac').keyup(event => {
    Forms.Static.checkCharactersForMac($('#input-static-router_mac').val(), '#err-router_mac');
});

// Reason for Static IP
$('#input-static-tkt_reason').on('change', () => {
    Forms.Static.checkBlank($('#input-static-tkt_reason').val(), '#err-tkt_reason');
    Forms.Static.checkSubmittable();
});

$('#btn-clear-confirmation-clear').on('click', () => {
    Forms.Static.checkSubmittable();
});

let Forms = new function()
{
    this.errors = [];   // Array of errors.
    this.error = false; // Is there an error?

    this.invalidChars = ['~', '!', '@', '#', '$', '^', '%', '*', '=', '+', '<', '>', '?', '|', '`']; // Non-valid chars for input.

    /**
     * Static IP Request Forms
     */
/**/this.Static = new function()
    {
        // Check if selection is blank.
        this.checkBlank = function(val, id)
        {
            if(val == 0 || val == '') // Can't be blank.
            {
                // Error displayed.
                Forms.error = true;
                Forms.errors.push(id);
                Forms.DisplayError(id, '#btn-static-tkt-submit', 'Field cannot be blank!');
            }
            else
                Forms.ResetError(id, '#btn-static-tkt-submit');

            //console.log(Forms.errors);
        }

        // Check for invalid characters in numeric fields.
        this.checkCharactersForNumeric = function(val, id)
        {
            if(val.length < 1) 
            {
                Forms.ResetError(id, '#btn-static-tkt-submit')
                return;
            }

            for(let i = 0; i < val.length; i++)
            {
                if(val[i].match(/^[`~!@#$%^&*()_|+\-=?;:'",.<>a-zA-Z]/))
                {
                    Forms.error = true;
                    Forms.errors.push(id);
                    Forms.DisplayError(id, '#btn-static-tkt-submit', 'Field contains invalid characters!');
                    break;
                }
                else if(val[i].match(' '))
                {
                    Forms.error = true;
                    Forms.errors.push(id);
                    Forms.DisplayError(id, '#btn-static-tkt-submit', 'Field contains whitespace!');
                    break;
                }

                Forms.ResetError(id, '#btn-static-tkt-submit');
            }
        }

        // Check for invalid characters in any field.
        this.checkCharacters = function(val, id)
        {
            if(val.length < 1) 
            {
                Forms.ResetError(id, '#btn-static-tkt-submit')
                return;
            }

            for(let i = 0; i < val.length; i++)
            {
                if(val[i].match(/^[`~!@#$%^&*()_|+\-=?;:'",.<>]/))
                {
                    Forms.error = true;
                    Forms.errors.push(id);
                    Forms.DisplayError(id, '#btn-static-tkt-submit', 'Field contains invalid characters!');
                    break;
                }

                Forms.ResetError(id, '#btn-static-tkt-submit');
            }
        }

        // Check for invalid characters for ip fields.
        this.checkCharactersForIp = function(val, id)
        {
            if(val.length < 1) 
            {
                Forms.ResetError(id, '#btn-static-tkt-submit')
                return;
            }

            for(let i = 0; i < val.length; i++)
            {
                if(val[i].match(/^[`~!@#$%^&*()_|+\-=?;:'",<>a-zA-Z]/))
                {
                    Forms.error = true;
                    Forms.errors.push(id);
                    Forms.DisplayError(id, '#btn-static-tkt-submit', 'Field contains invalid characters!');
                    break;
                }
                else if(val[i].match(' '))
                {
                    Forms.error = true;
                    Forms.errors.push(id);
                    Forms.DisplayError(id, 'Field contains whitespace!');
                    break;
                }

                Forms.ResetError(id, '#btn-static-tkt-submit', '#btn-static-tkt-submit');
            }
        }

        // Check for invalid characters for mac fields.
        this.checkCharactersForMac = function(val, id)
        {
            if(val.length < 1) 
            {
                Forms.ResetError(id, '#btn-static-tkt-submit', '#btn-static-tkt-submit')
                return;
            }

            for(let i = 0; i < val.length; i++)
            {
                if(val[i].match(/^[`~!@#$%^&*()_|+\-=?;'",<>]/))
                {
                    Forms.error = true;
                    Forms.errors.push(id);
                    Forms.DisplayError(id, '#btn-static-tkt-submit', 'Field contains invalid characters!');
                    break;
                }
                else if(val[i].match(' '))
                {
                    Forms.error = true;
                    Forms.errors.push(id);
                    Forms.DisplayError(id, '#btn-static-tkt-submit', 'Field contains whitespace!');
                    break;
                }

                Forms.ResetError(id, '#btn-static-tkt-submit');
            }
        }

        // Check if the submit button can be enabled.
        this.checkSubmittable = function()
        {
            if(Forms.error)
                return;

            if($('#input-static-customer_id').val() == '' || $('#input-static-customer_name').val() == '' || $('#input-static-radio_managed').val() == '' || $('#input-static-router_mac').val() == '' || $('#input-static-tkt_reason').val() == '')
            {
                $('#btn-static-tkt-submit').prop('disabled', true);
                $('#err-submit').text('Important fields are blank!');
            }
            else
            {
                $('#btn-static-tkt-submit').prop('disabled', false);
                $('#err-submit').text('');
            }
        }
    }

    /**
    * Displays error message given id. 
    */
/**/this.DisplayError = function(id, btn, err)
    {
        if(this.error)
        {
            $(id).text(err); // Show text.
            $(btn).prop('disabled', true); // Disable submit button.
        }
    }

    /**
     * Resets specified error message given id.
     */
/**/this.ResetError = function(id, btn)
    {
        // Remove element from array of errors based on value.
        if(this.errors.includes(id))
            for(let i = 0; i < this.errors.length; i++)
                if(this.errors[i] == id)
                    this.errors.splice(i, 1);


        if(this.errors.length < 1) // Check if there are still errors.
        {
            this.error = false;
            $(btn).prop('disabled', false); // Enable submit button.
            Forms.Static.checkSubmittable(); // Check if form is okay to submit.
        }
        
        $(id).text(''); // Reset error text.
    }
}