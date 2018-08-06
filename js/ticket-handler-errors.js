/**
 * Disable submit button as required fields are blank.
 */
$(() => {
    $('#btn-tkt-submit').prop('disabled', true);
    $('#err-submit').text('Important fields are blank!');
    
    // Radio buttons select on start: Default is false or first option.
    $('#input-job_tower_height-no').attr('checked', true);
    $('#input-cst_status-current').attr('checked', true).change();
    $('#input-cst_package-residential').attr('checked', true).change();
});

// ---------------- TEXT FIELDS ---------------------------

/**
 * Job type (job_type)
 * REQUIRED
 */
$('#input-job_type').on('change', () => {
    Forms.checkBlank($('#input-job_type').val(), '#err-job_type');
    // Forms.disableFields($('#input-job_type').val());
    Forms.checkSubmittable();
});

/**
 * Nearest tower (job_tower)
 * REQUIRED
 */
$('#input-job_tower').on('change', () => {
    Forms.checkBlank($('#input-job_tower').val(), '#err-job_tower');
    Forms.checkSubmittable();
    $('#input-job_zone').change(); // This will still have a blank error without
                                   // saying we changed the zone option.           
});

/**
 * Tower zone (job_zone)
 * REQUIRED
 */
$('#input-job_zone').on('change', () => {
    Forms.checkBlank($('#input-job_zone').val(), '#err-job_zone');
    Forms.checkSubmittable();
});

/**
 * Customer ID (cst_id)
 * REQUIRED
 */
$('#input-cst_id').on('change', () => {
    Forms.checkBlank($('#input-cst_id').val(), '#err-cst_id');
    Forms.checkSubmittable();
});
// Check for common errors
$('#input-cst_id').keyup(event => {
    Forms.checkCharactersForNumeric($('#input-cst_id').val(), '#err-cst_id');
});

/**
 * Customer Name (cst_name)
 * REQUIRED
 */
$('#input-cst_name').on('change', () => {
    Forms.checkBlank($('#input-cst_name').val(), '#err-cst_name');
    Forms.checkSubmittable();
});

/**
 * Customer Package (cst_package)
 * REQUIRED
 */
$('#input-cst_package').on('change', () => {
    Forms.checkBlank($('#input-cst_package').val(), '#err-cst_package');
    Forms.checkSubmittable();
});

/**
 * Radio Management IP (radio_management)
 * REQUIRED
 */
$('#input-radio_management').on('change', () => {
    Forms.checkBlank($('#input-radio_management').val(), '#err-radio_management');
    Forms.checkSubmittable();
});
$('#input-radio_management').keyup(event => {
    Forms.checkCharactersForIp($('#input-radio_management').val(), '#err-radio_management');
});

/**
 * Radio Public IP (radio_public)
 * REQUIRED
 */
$('#input-radio_public').on('change', () => {
    Forms.checkBlank($('#input-radio_public').val(), '#err-radio_public');
    Forms.checkSubmittable();
});
$('#input-radio_public').keyup(event => {
    Forms.checkCharactersForIp($('#input-radio_public').val(), '#err-radio_public')
});

/**
 * Radio MAC Address (radio_mac)
 * REQUIRED
 */
$('#input-radio_mac').on('change', () => {
    Forms.checkBlank($('#input-radio_mac').val(), '#err-radio_mac');
    Forms.checkSubmittable();
});
$('#input-radio_mac').keyup(event => {
    Forms.checkCharactersForMac($('#input-radio_mac').val(), '#err-radio_mac')
});

/**
 * Radio Type (radio_type)
 * REQUIRED
 */
$('#input-radio_type').on('change', () => {
    Forms.checkBlank($('#input-radio_type').val(), '#err-radio_type');
    Forms.checkSubmittable();
});

/**
 * Router MAC Address (router_mac)
 * REQUIRED
 */
$('#input-router_mac').on('change', () => {
    Forms.checkBlank($('#input-router_mac').val(), '#err-router_mac');
    Forms.checkSubmittable();
});
$('#input-router_mac').keyup(event => {
    Forms.checkCharactersForMac($('#input-router_mac').val(), '#err-router_mac')
});

/**
 * Radio Aggregate (radio_aggregate)
 * REQUIRED
 */
$('#input-radio_aggregate').on('change', () => {
    Forms.checkBlank($('#input-radio_aggregate').val(), '#err-radio_aggregate');
    Forms.checkSubmittable();
});

/**
 * Voip Mac Address (voip_mac)
 * REQUIRED
 */
$('#input-voip_mac').on('change', () => {
    Forms.checkBlank($('#input-voip_mac').val(), '#err-voip_mac');
    Forms.checkSubmittable();
});
$('#input-voip_mac').keyup(event => {
    Forms.checkCharactersForMac($('#input-voip_mac').val(), '#err-voip_mac');
});

/**
 * Radio Public IP (radio_public)
 * REQUIRED
 */
$('#input-voip_public').on('change', () => {
    Forms.checkBlank($('#input-voip_public').val(), '#err-voip_public');
    Forms.checkSubmittable();
});
$('#input-voip_public').keyup(event => {
    Forms.checkCharactersForIp($('#input-voip_public').val(), '#err-voip_public')
});

/**
 * Ticket Reason (tkt_reason) -- Static IP Escalation Specific
 * REQUIRED
 */
$('#input-tkt_reason').on('change', () => {
    Forms.checkBlank($('#input-tkt_reason').val(), '#err-tkt_reason');
    Forms.checkSubmittable();
});
$('#input-tkt_reason').keyup(event => {
    Forms.checkSubmittable();
});
// --------------------------------------------------------

/**
 * Must check if form is able to submit after clear, 
 * or user will be able to submit an empty ticket.
 */
$('#btn-clear-confirmation-clear').on('click', () => {
    setTimeout(() => Forms.checkSubmittable(), 0);
    // Wrapped in setTimeout to be called after
    // clear function is ran from the stack.    
});







let Forms = new function()
{
    this._errors = []; // Fields with errors
    this._blanks = []; // Blank fields
    this._error = false; // Is there an error?

    /**
     * Check for invalid characters in numeric fields.
     * 
     * @param {*} val 
     * @param {String} id 
     */
    this.checkCharactersForNumeric = function(val, id)
    {
        let blanks = this.getBlanks();
        let errors = this.getErrors();
        if(val.length < 1) {
            this.checkBlank(val, id);
            return;
        }
        let err = false;
        for(let i = 0; i < val.length; i++) {
            if(val[i].match(/^[`~!@#$%^&*()_|+\-=?;:'",.<>a-zA-Z]/)) {
                this.setError(true);
                this.addError(id);
                this.showError(id, 'Field contains invalid characters!');
                err = true;
                break;
            } else if(val[i].match(' ')) {
                this.setError(true);
                this.addError(id);
                this.showError(id, 'Field contains whitespace!');
                err = true;
                break;
            }
        }

        if(!err) {
            this.resetError(id, 'field');
            this.checkSubmittable();
        }
    }

    /**
     * Check for invalid characters in IP field.
     * 
     * @param {*} val 
     * @param {String} id 
     */
    this.checkCharactersForIp = function(val, id)
    {
        if(val.length < 1) {
            Forms.resetError(id, 'field');
            return;
        }
        let err = false;
        for(let i = 0; i < val.length; i++) {
            if(val[i].match(/^[`~!@#$%^&*()_|+\-=?;:'",<>a-zA-Z]/)) {
                this.setError(true);
                this.addError(id);
                this.showError(id, 'Field contains invalid characters!');
                err = true;
                break;
            }
            else if(val[i].match(' ')) {
                this.setError(true);
                this.addError(id);
                this.showError(id, 'Field contains whitespace!');
                err = true;
                break;
            }
        }

        if(!err) {
            this.resetError(id, 'field');
            this.checkSubmittable();
        }
    }

    /**
     * Check for invalid characters in MAC field.
     * 
     * @param {*} val 
     * @param {String} id 
     */
    this.checkCharactersForMac = function(val, id)
    {
        if(val.length < 1) {
            Forms.resetError(id, 'field');
            return;
        }
        let err = false;
        for(let i = 0; i < val.length; i++) {
            if(val[i].match(/^[`~!@#$%^&*()_|+\-=?;'",<>]/)) {
                this.setError(true);
                this.addError(id);
                this.showError(id, 'Field contains invalid characters!');
                err = true;
                break;
            }
            else if(val[i].match(' ')) {
                this.setError(true);
                this.addError(id);
                this.showError(id, 'Field contains whitespace!');
                err = true;
                break;
            }
        }

        if(!err) {
            this.resetError(id, 'field');
            this.checkSubmittable();
        }
    }

    /**
     * Field cannot be left blank.
     * Require field.
     * 
     * @param {*} val 
     * @param {String} id 
     */
    this.checkBlank = function(val, id)
    {
        if(val === 0 || val === '0' || val === '') { // Field is blank
            this.checkSubmittable();
            this.setError(true);
            this.addBlank(id);
            this.showError(id, 'Field cannot be blank!');
        }
        else {
            this.resetError(id, 'blank');
        }
    }

    /**
     * Check if form is able to be sumbitted.
     * All required fields are filled out
     * and their are no remaining errors.
     */
    this.checkSubmittable = function()
    {
        let blanks = this.getBlanks();
        let ids = builder.getInputIds();
        // Errors already exist
        if(this.hasError()) {
            if(blanks.length > 0) {
                $('#btn-tkt-submit').prop('disabled', true);
                $('#err-submit').text('Important fields are blank!');
            } else {
                $('#btn-tkt-submit').prop('disabled', true);
                $('#err-submit').text('Input errors exist!');
            }
            return;
        }
        // If no erros exist, check anyway
        let blank = false;
        ids.forEach(element => {
            if(element === 'tkt_notes' || element === 'voip_callid' || element === 'radio_ap_count' || element === 'radio_ssid' || element === 'radio_quality' || element === 'radio_ccq' || element === 'radio_signal_last' || element === 'radio_signal' || element === 'radio_speedtest' || element === 'cst_torch' || element === 'cst_speedtest') {} // Skip
            else { 
                //console.log($('#input-' + element).val() == '' && !($('#input-' + element).is(':disabled')));
                if($('#input-' + element).val() == '' && !($('#input-' + element).is(':disabled'))) { // Blank
                    $('#btn-tkt-submit').prop('disabled', true);
                    $('#err-submit').text('Important fields are blank!');
                    blank = true;
                }
            }
        });
        if(!blank) { // Ready to submit
            $('#btn-tkt-submit').prop('disabled', false);
            $('#err-submit').text('');
        }
    }

    /**
     * Display error to user by element
     * id.
     * 
     * @param {String} id 
     * @param {String} text 
     */
    this.showError = function(id, text)
    {
        if(this.hasError()) {
            $(id).text(text); // Show text
            $('#btn-tkt-submit').prop('disabled', true); // Disable submit button
        }
    }

    /**
     * Reset error when resolved.
     * If an error another error exists,
     * display that error.
     * type: 'blank', 'field'
     * 
     * @param {String} id 
     * @param {String} type 
     */
    this.resetError = function(id, type)
    {
        let blanks = this.getBlanks();
        let errors = this.getErrors();
        if(type === 'blank') {
            if(errors.includes(id)) return;
            if(blanks.includes(id)) {
                for(let i = 0; i < blanks.length; i++) {
                    if(blanks[i] === id) {
                        blanks.splice(i, 1); // Remove id from array.
                    }
                }
            }
            this.setBlanks(blanks);

            $(id).text('');
        }
        else if(type === 'field') {
            if(errors.includes(id)) {
                for(let i = 0; i < errors.length; i++) {
                    if(errors[i] === id) {
                        errors.splice(i, 1); // Remove id from array.
                    }
                }
            }
            this.setErrors(errors);

            $(id).text('');
        }

        if(blanks.length < 1 && errors.length < 1) {
            this.setError(false);
        }
    }


    // GETTERS / SETTERS

    /**
     * Add element by id to blank
     * array.
     * 
     * @param {String} id 
     */
    this.addBlank = function(id)
    {
        if(!this._blanks.includes(id)) {
            this._blanks.push(id);
        }
    }
    /**
     * Get the blanks array.
     */
    this.getBlanks = function()
    {
        return this._blanks;
    }
    /**
     * Set blanks array with array.
     * 
     * @param {Array} arry 
     */
    this.setBlanks = function(arry)
    {
        this._blanks = arry;
    }

    /**
     * Add element by id to errors
     * array.
     * 
     * @param {String} id 
     */
    this.addError = function(id)
    {
        if(!this._errors.includes(id)) {
            this._errors.push(id);
        }
    }
    /**
     * Set error true or false.
     * 
     * @param {Boolean} bool 
     */
    this.setError = function(bool) 
    {
        this._error = bool;
    }
    /**
     * Error exists?
     */
    this.hasError = function()
    {
        return this._error;
    }
    /**
     * Get the errors array.
     */
    this.getErrors = function()
    {
        return this._errors;
    }
    /**
     * Set errors array with array.
     * 
     * @param {Array} arry 
     */
    this.setErrors = function(arry)
    {
        this._errors = arry;
    }
}