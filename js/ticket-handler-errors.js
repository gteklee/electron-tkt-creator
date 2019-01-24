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
 * Job Reason (job_reason)
 * REQUIRED
 */
$('#input-job_reason').on('change', () => {
    Forms.checkBlank($('#input-job_reason').val(), '#err-job_reason');
    Forms.checkSubmittable();
});

/**
 * Job Expectations (job_expectations)
 * REQUIRED
 */
$('#input-job_expectations').on('change', () => {
    Forms.checkBlank($('#input-job_expectations').val(), '#err-job_expectations');
    Forms.checkSubmittable();
});

/**
 * Job Building Type (job_building_type)
 * REQUIRED
 */
$('#input-job_building_type').on('change', () => {
    Forms.checkBlank($('#input-job_building_type').val(), '#err-job_building_type');
    Forms.checkSubmittable();
});

/**
 * Job Building Roof Type (job_building_roof)
 * REQUIRED
 */
$('#input-job_building_roof').on('change', () => {
    Forms.checkBlank($('#input-job_building_roof').val(), '#err-job_building_roof');
    Forms.checkSubmittable();
});

/**
 * Job Building Floor Count (job_building_floors)
 * REQUIRED
 */
$('#input-job_building_floors').on('change', () => {
    Forms.checkBlank($('#input-job_building_floors').val(), '#err-job_building_floors');
    Forms.checkSubmittable();
});
// Check for common errors
$('#input-job_building_floors').keyup(event => {
    Forms.checkCharactersForNumeric($('#input-job_building_floors').val(), '#err-job_building_floors');
});

/**
 * Job Time Period (job_time)
 * REQUIRED
 */
$('#input-job_time').on('change', () => {
    Forms.checkBlank($('#input-job_time').val(), '#err-job_time');
    Forms.checkSubmittable();
});

/**
 * Job Disconnect Address (job_address_disco)
 * REQUIRED
 */
$('#input-job_address_disco').on('change', () => {
    Forms.checkBlank($('#input-job_address_disco').val(), '#err-job_address_disco');
    Forms.checkSubmittable();
});

/**
 * Job Disconnect City (job_city_disco)
 * REQUIRED
 */
$('#input-job_city_disco').on('change', () => {
    Forms.checkBlank($('#input-job_city_disco').val(), '#err-job_city_disco');
    Forms.checkSubmittable();
});

/**
 * Job Installation Address (job_address_inst)
 * REQUIRED
 */
$('#input-job_address_inst').on('change', () => {
    Forms.checkBlank($('#input-job_address_inst').val(), '#err-job_address_inst');
    Forms.checkSubmittable();
});

/**
 * Job Installation City (job_address_inst)
 * REQUIRED
 */
$('#input-job_city_inst').on('change', () => {
    Forms.checkBlank($('#input-job_city_inst').val(), '#err-job_city_inst');
    Forms.checkSubmittable();
});

/**
 * Job Installation Address (job_address_inst)
 * REQUIRED
 */
$('#input-job_address_survey').on('change', () => {
    Forms.checkBlank($('#input-job_address_survey').val(), '#err-job_address_survey');
    Forms.checkSubmittable();
});

/**
 * Job Installation City (job_address_inst)
 * REQUIRED
 */
$('#input-job_city_survey').on('change', () => {
    Forms.checkBlank($('#input-job_city_survey').val(), '#err-job_city_survey');
    Forms.checkSubmittable();
});

/**
 * Customer ID (cst_id)
 * REQUIRED
 */
$('#input-cst_id').on('change', () => {
    if($('#input-cst_status-new').is(':checked')) {
        return;
    }

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
 * Customer Phone Number (cst_phone)
 * REQUIRED
 */
$('#input-cst_phone').on('change', () => {
    Forms.checkBlank($('#input-cst_phone').val(), '#err-cst_phone');
    Forms.checkSubmittable();
});

/**
 * Customer Unit Number (cst_unit)
 * REQUIRED
 */
$('#input-cst_unit').on('change', () => {
    Forms.checkBlank($('#input-cst_unit').val(), '#err-cst_unit');
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
 * Customer Contract Agreement (cst_contract)
 * REQUIRED
 */
$('#input-cst_contract').on('change', () => {
    Forms.checkBlank($('#input-cst_contract').val(), '#err-cst_contract');
    Forms.checkSubmittable();
});

/**
 * Customer Contract Price (cst_contract_price)
 * REQUIRED
 */
$('#input-cst_contract_price').on('change', () => {
    Forms.checkBlank($('#input-cst_contract_price').val(), '#err-cst_contract');
    Forms.checkSubmittable();
});

/**
 * Customer VOIP Contract Agreement (cst_contract_voip)
 * REQUIRED
 */
$('#input-cst_contract_voip').on('change', () => {
    Forms.checkBlank($('#input-cst_contract_voip').val(), '#err-cst_contract_voip');
    Forms.checkSubmittable();
});

/**
 * Customer Router Options (cst_managed)
 * REQUIRED
 */
$('#input-cst_managed').on('change', () => {
    Forms.checkBlank($('#input-cst_managed').val(), '#err-cst_managed');
    Forms.checkSubmittable();
});

/**
 * Customer Maintenance Plan (cst_maint)
 * REQUIRED)
 */
$('#input-cst_maint').on('change', () => {
    Forms.checkBlank($('#input-cst_maint').val(), '#err-cst_maint');
    Forms.checkSubmittable();
});

/**
 * Customer Statements (cst_statements)
 * REQUIRED)
 */
$('#input-cst_statements').on('change', () => {
    Forms.checkBlank($('#input-cst_statements').val(), '#err-cst_statements');
    Forms.checkSubmittable();
});

/**
 * Customer Attic Run (cst_attic)
 * REQUIRED)
 */
$('#input-cst_attic').on('change', () => {
    Forms.checkBlank($('#input-cst_attic').val(), '#err-cst_attic');
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

$('#input-radio_ssid').on('change', () => {
    Forms.checkCharactersForBreakingChar($('#input-radio_ssid').val(), '#input-radio_ssid');
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
    // Forms.checkBlank($('#input-voip_mac').val(), '#err-voip_mac');
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
    // Forms.checkBlank($('#input-voip_public').val(), '#err-voip_public');
    Forms.checkSubmittable();
});
$('#input-voip_public').keyup(event => {
    Forms.checkCharactersForIp($('#input-voip_public').val(), '#err-voip_public')
});

/**
 * VOIP Caller ID
 * Limit 15 characters
 */
$('#input-voip_callid').keyup(event => {
    Forms.checkCharacters15Limit($('#input-voip_callid').val(), '#err-voip_callid');
});

/**
 * VOIP Current Customer Radio Buttons
 */
$('#input-cst_status-current').on('change', () => {
    if($('#input-cst_status-current').is(':checked')) { // Fail safe
        Forms.checkSubmittable();
    }
});
$('#input-cst_status-new').on('change', () => {
    if($('#input-cst_status-new').is(':checked')) { // Fail safe
        Forms.checkSubmittable();
    }
});

/**
 * MTL / MDU Sonar ID (mtl_id)
 */
$('#input-mtl_id').on('change', () => {
    Forms.checkBlank($('#input-mtl_id').val(), '#err-mtl_id');
    Forms.checkSubmittable();
});
// Check for common errors
$('#input-mtl_id').keyup(event => {
    Forms.checkCharactersForNumeric($('#input-mtl_id').val(), '#err-mtl_id');
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

/**
 * Important Information Confirmation for Installation (info_confirm_install)
 */
$('#input-info_confirm_install').on('change', () => {
    Forms.checkSubmittable();
});

/**
 * Important Information Confirmation for Relocation (info_confirm_relo)
 */
$('#input-info_confirm_relo').on('change', () => {
    Forms.checkSubmittable();
});

/**
 * Important Information Confirmation for Site Survey (info_confirm_survey)
 */
$('#input-info_confirm_survey').on('change', () => {
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
        if(val.length < 1 && !($('#input-cst_status-new').is(':checked'))) {
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
     * 
     * @param {*} val 
     * @param {String} id 
     */
    this.checkCharacters15Limit = function(val, id)
    {
        if(val.length < 1) {
            Forms.resetError(id, 'field');
            return;
        }
        let err = false;
        // Check length of caller id
        if(val.length > 15) {
            this.setError(true);
            this.addError(id);
            this.showError(id, 'Caller ID is too long!');
            err = true;
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
     * Removes any character that causes a problem when submitting
     * the form to Sonar. There are some characters Sonar will 
     * reject: 
     * '°' (degree symbol)
     * 
     * @param {String} val 
     * @param {String} id 
     */
    this.checkCharactersForBreakingChar = function(val, id)
    {
        if(val.includes('°')) { // Check if includes degree symbol
            let fix = val;
            do {
                fix = fix.replace('°', ''); // Remove degree symbol
            } while(fix.includes('°'));
            $(id).val(fix); // Set new fixed value
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
            if((element === 'info_confirm_survey' && $('#input-info_confirm_survey').is(':checked')) || (element === 'info_confirm_install' && $('#input-info_confirm_install').is(':checked')) || (element === 'info_confirm_relo' && $('#input-info_confirm_relo').is(':checked')) || (element === 'cst_id' && $('#input-cst_status-new').is(':checked')) || element === 'voip_mac' || element === 'voip_public' || element === 'job_occupancy' || element === 'job_population' || element === 'job_reason_survey' || element === 'tkt_notes' || element === 'tkt_reason_static' || element === 'voip_callid' || element === 'radio_ap_count' || element === 'radio_ssid' || element === 'radio_quality' || element === 'radio_ccq' || element === 'radio_signal_last' || element === 'radio_signal' || element === 'radio_speedtest' || element === 'cst_torch' || element === 'cst_speedtest' || element === 'special_equipment') {} // Skip
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