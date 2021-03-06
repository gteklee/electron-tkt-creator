function FormBuilder()
{   // Rendering a customer search form?
    this._customer_search = false;
    // All form input ids
    this._inputIds = [];

    /**
     * String passed in determines the section
     * to be created before the form.
     * -- "Search-Customer"
     * -- ""
     * 
     * @param {String} type
     * @param {String} section
     * @param {String} identifier (Optional)
     */
    this.Create = function(type, section, identifier)
    {
        // Create a customer search section
        if(type === "Search-Customer") {
            this._renderCustomerSearch(section, identifier);
            this._customer_search = true;
        }
    }

    /**
     * Creates a form from an array of objects
     * with a title, and fields that need to be
     * added to that specific section.
     * 
     * @param {array} objArray 
     * @param {String} section
     * @param {String} identifier
     */
    this.CreateForm = function(objArray, section, identifier)
    {
        if(objArray.length < 1) {
            console.error('Object Array passed to CreateForm is empty!');
            return;
        }

        this.setInputIds(objArray);
        this._renderForm(objArray, section, identifier);
    }

    /**
     * Sets the title of the page.
     * @param {String} title
     * @param {String} section
     */
    this.Title = function(title, section)
    {
        this._renderTitle(title, section);
    }

    /**
     * GETTERS / SETTERS
     */

    /**
     * Get all form input ids.
     */
    this.getInputIds = function() 
    {
        return this._inputIds;
    }
    
    /**
     * Set all form input ids.
     * 
     * @param {Array} objArray
     */
    this.setInputIds = function(objArray)
    {   // Current index of the array being changed
        let pos = 0;
        for(let i = 0; i < objArray.length; i++) {
            for(let j = 0; j < objArray[i].fields.length; j++) {
                this._inputIds[pos] = objArray[i].fields[j];
                pos++;
            }
        }
    }

    /**
     * PRIVATE
     * Creates the event listeners for the elements passed in.
     * 
     * @param {Array} objArray 
     */
    this._createEventListeners = function(objArray)
    {
        if(objArray.length < 1) {
            console.error('Array of objects is empty!');
            return;
        }

        console.log(objArray);
        for(let i = 0; i < objArray.length; i++) {

            if(objArray[i].type === 'button') {
                $('#'+objArray[i].element).on('click', () => {
                    console.log('Woah');
                });
            }
            else if(objArray[i].type === 'text') {

            }
            else {
                console.error('Type does not exist for ' + objArray[i].element);
            }
        }
    }

    /**
     * PRIVATE
     * Renders the title of the page.
     * @param {String} title 
     * @param {String} section 
     * @param {String} identifier (Optional)
     */
    this._renderTitle = function(title, section, identifier)
    {
        let titleHeader = '<div class="title-header" id="title-header">'+
                              '<h1 class="title">' + title + '</h1>'+
                          '</div>'

        if(identifier) {
            $('section#'+section+' '+identifier).prepend(titleHeader);
        }
        else {
            $('section#'+section).prepend(titleHeader);
        }
    }

    /**
     * PRIVATE
     * Renders the Customer Search section 
     * to the page.
     * 
     * @param {String} section
     * @param {String} identifier (Optional)
     */
    this._renderCustomerSearch = function(section, identifier)
    {
        let stringHtml = '<div class="input-block-container" id="input-customer-search">'+
                            '<div class="header-container">'+
                                '<h1 class="input-block-header"> Search For Customer </h1>'+
                            '</div>'+
                            '<p class="input-header"> ID </p>'+
                            '<input type="text" id="input-customer-search-cst-id" name="cst-id"/>'+
                            '<div class="err-container">'+
                                '<p class="err-msg" id="err-search-cst_id"></p>'+
                            '</div>'+
                            '<div class="btn-container">'+
                                '<input type="button" class="btn" id="btn-check-acnt" value="CHECK ACCOUNT" style="margin-top: 50px; margin-bottom: 5px;"/>'+
                            '</div>'+
                            '<div class="header-container">'+
                                '<p class="input-header"> OR </p>'+
                            '</div>'+
                            '<div class="btn-container">'+
                                '<input type="button" class="btn" id="btn-create-tkt" value="CREATE EMPTY TICKET" style="margin-top: 5px;"/>'+
                            '</div>'+
                        '</div>'+
                        '<div class="input-block-hidden" id="input-customer-confirm">'+
                            '<div class="header-container" id="input-block-header-cst-confirm">'+
                                '<h1 class="input-block-header"> Confirm Account </h1>'+
                            '</div>'+
    
                            '<div class="info-container">'+
                                '<p class="input-header" id="info-confirm-cst_id"> Account Found: </p>'+
                            '</div>'+
    
                            '<div class="btn-container">'+
                                '<input type="button" class="btn-confirm" value="CONFIRM" id="btn-cst-confirm"/>'+
                                '<input type="button" class="btn-confirm" value="DENY" id="btn-cst-deny"/>'+
                            '</div>'+
                        '</div>';

        if(identifier)
            $('section#'+section+' '+identifier).append(stringHtml);
        else
            $('section#'+section).append(stringHtml);
    }

    /**
     * 
     * @param {*} objArray 
     * @param {*} section 
     * @param {*} identifier (Optional)
     */
    this._renderForm = function(objArray, section, identifier)
    {
        if(this._customer_search) { // Add back button to form.
            $('<div class="bbtn-container-hidden" id="back-btn">'+
                  '<i class="fas fa-chevron-circle-left fa-2x" id="back-btn-icon"></i>'+
              '</div>').insertAfter('#title-header');
        }

        let form = '<div class="alert-blur"></div>';
        form += '<div class="input-block-hidden" id="input-ticket-template">';

        for(let i = 0; i < objArray.length; i++) {
            form += '<div class="input-block" id="input-block-' + this._createID(objArray[i].title) + '">'+
                        '<h1 class="input-block-header"> ' + objArray[i].title + ' </h1>';
            
            for(let j = 0; j < objArray[i].fields.length; j++) {
                if(objArray[i].fields[j] === 'job_type') {
                    form += '<p class="input-header" id="input-header-job_type"> JOB TYPE </p>'+
                            '<select id="input-job_type">'+
                                '<option value="">  </option>'+
                                '<option value=1> Radio down </option>'+
                                '<option value=2> No connection </option>'+
                                '<option value=3> Intermittent connection </option>'+
                                '<option value=4> Slow/Interm Speeds </option>'+
                                '<option value=5> Poor Signal </option>'+
                                '<option value=6> Conversion </option>'+
                                '<option value=7> Onsite </option>'+
                                '<option value=8> Misc. </option>'+
                            '</select>'+
                            '<div class="err-container">'+
                                '<p class="err-msg" id="err-job_type"></p>'+
                            '</div>';
                }
                else if(objArray[i].fields[j] === 'job_tower') {
                    form += '<p class="input-header" id="input-header-job_tower"> NEAREST TOWER </p>'+
                            '<select id="input-job_tower">'+
                            '</select>'+
                            '<div class="err-container">'+
                                '<p class="err-msg" id="err-job_tower"></p>'+
                            '</div>';
                }
                else if(objArray[i].fields[j] === 'job_tower_height') {
                    form += '<p class="input-header" id="input-header-job_tower_height"> 40-50 FOOT TOWER REQUIRED? </p>'+
                            '<input id="input-job_tower_height-yes" type="radio" name="height" value="Yes"> Yes <br>'+
                            '<input id="input-job_tower_height-no" type="radio" name="height" value="No"> No';
                }
                else if(objArray[i].fields[j] === 'job_zone') {
                    form += '<p class="input-header" id="input-header-job_zone"> ZONE </p>'+
                            '<select id="input-job_zone">'+
                                '<option value="">   </option>'+
                                '<option value="1"> 1 </option>'+
                                '<option value="2"> 2 </option>'+
                                '<option value="3"> 3 </option>'+
                                '<option value="4"> 4 </option>'+
                                '<option value="5"> 5 </option>'+
                                '<option value="6"> 6 </option>'+
                                '<option value="7"> 7 </option>'+
                                '<option value="8"> 8 </option>'+
                            '</select>'+
                            '<div class="err-container">'+
                                '<p class="err-msg" id="err-job_zone"></p>'+
                            '</div>';
                }
                else if(objArray[i].fields[j] === 'job_reason') {
                    form += '<p class="input-header" id="input-header-job_reason"> REASON FOR JOB </p>'+
                            '<textarea id="input-job_reason" rows="6" placeholder="Why are you creating this ticket? Please provide specific details!"></textarea>'+
                            '<div class="err-container">'+
                                '<p class="err-msg" id="err-job_reason"></p>'+
                            '</div>'
                }
                else if(objArray[i].fields[j] === 'job_expectations') {
                    form += '<p class="input-header" id="input-header-job_expectations"> EXPECTED WORK TO BE DONE </p>'+
                            '<textarea id="input-job_expectations" rows="6" placeholder="What is the customer wanting the technician to accomplish while on site?"></textarea>'+
                            '<div class="err-container">'+
                                '<p class="err-msg" id="err-job_expectations"></p>'+
                            '</div>'
                }
                else if(objArray[i].fields[j] === 'job_building_type') {
                    form += '<p class="input-header" id="input-header-job_building_type"> BUILDING TYPE </p>'+
                            '<input id="input-job_building_type" type="text" name="job_building_type"/>'+
                            '<div class="err-container">'+
                            '   <p class="err-msg" id="err-job_building_type"></p>'+
                            '</div>';
                }
                else if(objArray[i].fields[j] === 'job_building_roof') {
                    form += '<p class="input-header" id="input-header-job_building_roof"> BUILDING ROOF TYPE </p>'+
                            '<input id="input-job_building_roof" type="text" name="job_building_roof"/>'+
                            '<div class="err-container">'+
                            '   <p class="err-msg" id="err-job_building_roof"></p>'+
                            '</div>';
                }
                else if(objArray[i].fields[j] === 'job_building_floors') {
                    form += '<p class="input-header" id="input-header-job_building_floors"> BUILDING FLOOR COUNT </p>'+
                            '<input id="input-job_building_floors" type="text" name="job_building_floors"/>'+
                            '<div class="err-container">'+
                            '   <p class="err-msg" id="err-job_building_floors"></p>'+
                            '</div>';
                }
                else if(objArray[i].fields[j] === 'job_date') {
                    form += '<p class="input-header" id="input-header-job_time"> DATE (mm/dd/YYYY) </p>'+
                            '<input id="input-job_date" type="text" name="job_date"/>'+
                            '<div class="err-container">'+
                            '   <p class="err-msg" id="err-job_building_floors"></p>'+
                            '</div>';
                }
                else if(objArray[i].fields[j] === 'job_time') {
                    form += '<p class="input-header" id="input-header-job_time"> TIME PERIOD </p>'+
                            '<select id="input-job_time">'+
                                '<option value="AM"> A.M. </option>'+
                                '<option value="PM"> P.M. </option>'+
                            '</select>'+
                            '<div class="err-container">'+
                            '   <p class="err-msg" id="err-job_time"></p>'+
                            '</div>';
                }
                else if(objArray[i].fields[j] === 'job_address_disco') {
                    form += '<p class="input-header" id="input-header-job_address_disco"> PHYSICAL ADDRESS OF DISCONNECT </p>'+
                            '<input id="input-job_address_disco" type="text" name="job_address_disco"/>'+
                            '<div class="err-container">'+
                            '   <p class="err-msg" id="err-job_address_disco"></p>'+
                            '</div>';
                }
                else if(objArray[i].fields[j] === 'job_city_disco') {
                    form += '<p class="input-header" id="input-header-job_city_disco"> CITY, STATE ZIP OF DISCONNECT </p>'+
                            '<input id="input-job_city_disco" type="text" name="job_city_disco"/>'+
                            '<div class="err-container">'+
                            '   <p class="err-msg" id="err-job_city_disco"></p>'+
                            '</div>';
                }
                else if(objArray[i].fields[j] === 'job_address_inst') {
                    form += '<p class="input-header" id="input-header-job_address_inst"> PHYSICAL ADDRESS OF INSTALL </p>'+
                            '<input id="input-job_address_inst" type="text" name="job_address_inst"/>'+
                            '<div class="err-container">'+
                            '   <p class="err-msg" id="err-job_address_inst"></p>'+
                            '</div>';
                }
                else if(objArray[i].fields[j] === 'job_city_inst') {
                    form += '<p class="input-header" id="input-header-job_city_inst"> CITY, STATE ZIP OF INSTALL </p>'+
                            '<input id="input-job_city_inst" type="text" name="job_city_inst"/>'+
                            '<div class="err-container">'+
                            '   <p class="err-msg" id="err-job_city_inst"></p>'+
                            '</div>';
                }
                else if(objArray[i].fields[j] === 'job_address_survey') {
                    form += '<p class="input-header" id="input-header-job_address_survey"> PHYSICAL ADDRESS OF SITE </p>'+
                            '<input id="input-job_address_survey" type="text" name="job_address_survey"/>'+
                            '<div class="err-container">'+
                            '   <p class="err-msg" id="err-job_address_survey"></p>'+
                            '</div>'; 
                }
                else if(objArray[i].fields[j] === 'job_city_survey') {
                    form += '<p class="input-header" id="input-header-job_city_survey"> CITY, STATE ZIP OF SITE </p>'+
                            '<input id="input-job_city_survey" type="text" name="job_city_survey"/>'+
                            '<div class="err-container">'+
                            '   <p class="err-msg" id="err-job_city_survey"></p>'+
                            '</div>';
                }
                else if(objArray[i].fields[j] === 'job_property') {
                    form += '<p class="input-header" id="input-header-job_property"> TYPE OF PROPERTY </p>'+
                            '<select id="input-job_property">'+
                                '<option value="Residence"> Residence </option>'+
                                '<option value="Business"> Business </option>'+
                                '<option value="RV Park"> RV Park </option>'+
                                '<option value="Apartment"> Apartment </option>'+
                            '</select>'+
                            '<div class="err-container">'+
                            '   <p class="err-msg" id="err-job_property"></p>'+
                            '</div>';
                }
                else if(objArray[i].fields[j] === 'job_occupancy') {
                    form += '<p class="input-header" id="input-header-job_occupancy"> OCCUPANCY (RV SPOTS, APARTMENTS, </br> SQUARE FOOTAGE, ETC.) </p>'+
                            '<input id="input-job_occupancy" type="text" name="job_occupancy"/>'+
                            '<div class="err-container">'+
                            '   <p class="err-msg" id="err-job_occupancy"></p>'+
                            '</div>';
                }
                else if(objArray[i].fields[j] === 'job_population') {
                    form += '<p class="input-header" id="input-header-job_population"> POPULATION AT SITE </p>'+
                            '<input id="input-job_population" type="text" name="job_population"/>'+
                            '<div class="err-container">'+
                            '   <p class="err-msg" id="err-job_population"></p>'+
                            '</div>';
                }
                else if(objArray[i].fields[j] === 'job_reason_survey') {
                    form += '<p class="input-header" id="input-header-job_reason_survey"> REASON FOR SITE SURVEY </p>'+
                            '<textarea id="input-job_reason_survey" rows="6" placeholder="Why are you creating this site survey? Utility pole location, business, etc."></textarea>'+
                            '<div class="err-container">'+
                                '<p class="err-msg" id="err-job_reason_survey"></p>'+
                            '</div>'
                }
                else if(objArray[i].fields[j] === 'job_wifi') {
                    form += '<p class="input-header" id="input-header-job_wifi"> DOES THE CUSTOMER WANT TO PROVIDE </br> FREE WIFI TO PEOPLE ONSITE? </p>'+
                            '<input id="input-job_wifi-yes" type="radio" name="job_wifi" value="Yes"> Yes <br>'+
                            '<input id="input-job_wifi-no" type="radio" name="job_wifi" value="No"> No <br>'+
                            '<div>'+ 
                                '<input id="input-job_wifi-other" type="radio" name="job_wifi" value="Other"> Other <br>'+
                                '<input style="margin-top:10px;" disabled="false" id="input-job_wifi-text" type="text" name="job_wifi-other"/>'+
                            '</div>';
                }
                else if(objArray[i].fields[j] === 'cst_id') {
                    form += '<p class="input-header" id="input-header-cst_id"> CUSTOMER ID </p>'+
                            '<input id="input-cst_id" type="text" name="cst_id"/>'+
                            '<div class="err-container">'+
                            '   <p class="err-msg" id="err-cst_id"></p>'+
                            '</div>';
                }
                else if(objArray[i].fields[j] === 'cst_name') {
                    form += '<p class="input-header" id="input-header-cst_name"> CUSTOMER NAME </p>'+
                            '<input id="input-cst_name" type="text" name="cst_name"/>'+
                            '<div class="err-container">'+
                            '   <p class="err-msg" id="err-cst_name"></p>'+
                            '</div>';
                }
                else if(objArray[i].fields[j] === 'cst_phone') {
                    form += '<p class="input-header" id="input-header-cst_phone"> CUSTOMER PHONE NUMBER </p>'+
                            '<input id="input-cst_phone" type="text" name="cst_phone"/>'+
                            '<div class="err-container">'+
                            '   <p class="err-msg" id="err-cst_phone"></p>'+
                            '</div>';
                }
                else if(objArray[i].fields[j] === 'cst_unit') {
                    form += '<p class="input-header" id="input-header-cst_unit"> CUSTOMER UNIT NUMBER </p>'+
                            '<input id="input-cst_unit" type="text" name="cst_unit"/>'+
                            '<div class="err-container">'+
                            '   <p class="err-msg" id="err-cst_unit"></p>'+
                            '</div>';
                }
                else if(objArray[i].fields[j] === 'cst_site') {
                    form += '<p class="input-header" id="input-header-cst_site"> CUSTOMER SITE NUMBER </p>'+
                            '<input id="input-cst_site" type="text" name="cst_site"/>'+
                            '<div class="err-container">'+
                            '   <p class="err-msg" id="err-cst_site"></p>'+
                            '</div>';
                }
                else if(objArray[i].fields[j] === 'cst_status') {
                    form += '<p class="input-header" id="input-header-cst_status"> CUSTOMER STATUS </p>'+
                            '<input id="input-cst_status-current" type="radio" name="status" value="current"> Current Customer <br>'+
                            '<input id="input-cst_status-new" type="radio" name="status" value="new"> New Customer'+
                            '<div class="err-container">'+
                            '   <p class="err-msg" id="err-cst_status"></p>'+
                            '</div>';
                }
                else if(objArray[i].fields[j] === 'cst_package') {
                    form += '<p class="input-header" id="input-header-cst_package"> SERVICE PACKAGE </p>'+
                            '<div class="input-group" id="input-group-cst_package">'+
                                '<input id="input-cst_package-residential" type="radio" name="package" value="Residential"> Residential <br>'+
                                '<input id="input-cst_package-business" type="radio" name="package" value="Business"> Business <br>'+
                                '<input id="input-cst_package-other" type="radio" name="package" value="Other"> Other <br>'+
                                '<select id="input-cst_package">'+
                                '</select>'+
                            '</div>'+
                            '<div class="err-container">'+
                            '   <p class="err-msg" id="err-cst_package"></p>'+
                            '</div>';
                }
                else if(objArray[i].fields[j] === 'cst_contract') {
                    form += '<p class="input-header" id="input-header-cst_contract"> CONTRACT AGREEMENT </p>'+
                            '<div class="input-group" id="input-group-cst_contract">'+
                                '<select id="input-cst_contract">'+
                                    '<option value=""></option>'+
                                    '<option value="1 Year Agreement"> 1 Year Agreement </option>'+
                                    '<option value="2 Year Agreement"> 2 Year Agreement </option>'+
                                    '<option value="No Contract"> No Contract </option>'+
                                '</select>'+
                                '<select id="input-cst_contract_price">'+
                                    '<option value=""></option>'+
                                    '<option value="$75"> $75 </option>'+
                                    '<option value="$150"> $150 </option>'+
                                    '<option value="$300"> $300 </option>'+
                                    '<option value="Waived"> Waived </option>'+
                                '</select>'+
                                '<div class="err-container">'+
                                '   <p class="err-msg" id="err-cst_contract"></p>'+
                                '</div>'+
                            '</div>';
                }
                else if(objArray[i].fields[j] === 'cst_contract_voip') {
                    form += '<p class="input-header" id="input-header-cst_contract_voip"> VOIP CONTRACT AGREEMENT </p>'+
                            '<select id="input-cst_contract_voip">'+
                                '<option value=""></option>'+
                                '<option value="Not Interested"> Not Interested </option>'+
                                '<option value="1 Year Agreement"> 1 Year Agreement </option>'+
                                '<option value="No Contract"> No Contract </option>'+
                            '</select>'+
                            '<div class="err-container">'+
                            '   <p class="err-msg" id="err-cst_contract_voip"></p>'+
                            '</div>';
                }
                else if(objArray[i].fields[j] === 'cst_managed') {
                    form += '<p class="input-header" id="input-header-cst_managed"> ROUTER OPTIONS </p>'+
                            '<select id="input-cst_managed">'+
                                '<option value=""></option>'+
                                '<option value="Managed Router"> Managed Router </option>'+
                                '<option value="Purchase Router"> Purchase Router </option>'+
                                '<option value="Provide Their Own"> Provide Their Own </option>'+
                            '</select>'+
                            '<div class="err-container">'+
                            '   <p class="err-msg" id="err-cst_managed"></p>'+
                            '</div>';
                }
                else if(objArray[i].fields[j] === 'cst_maint') {
                    form += '<p class="input-header" id="input-header-cst_maint"> SERVICE MAINTENANCE PLAN </p>'+
                            '<select id="input-cst_maint">'+
                                '<option value=""></option>'+
                                '<option value="Not Interested"> Not Interested </option>'+
                                '<option value="Interested"> Interested </option>'+
                            '</select>'+
                            '<div class="err-container">'+
                            '   <p class="err-msg" id="err-cst_maint"></p>'+
                            '</div>';
                }
                else if(objArray[i].fields[j] === 'cst_statements') {
                    form += '<p class="input-header" id="input-header-cst_statements"> STATEMENT OPTIONS </p>'+
                            '<select id="input-cst_statements">'+
                                '<option value=""></option>'+
                                '<option value="Email"> Email </option>'+
                                '<option value="Paper ($3 Monthly Fee)"> Paper ($3 Monthly Fee) </option>'+
                            '</select>'+
                            '<div class="err-container">'+
                            '   <p class="err-msg" id="err-cst_statements"></p>'+
                            '</div>';
                }
                else if(objArray[i].fields[j] === 'cst_attic') {
                    form += '<p class="input-header" id="input-header-cst_attic"> ATTIC RUN ($95 / HOUR FEE) </p>'+
                            '<select id="input-cst_attic">'+
                                '<option value=""></option>'+
                                '<option value="No"> No </option>'+
                                '<option value="Yes"> Yes </option>'+
                            '</select>'+
                            '<div class="err-container">'+
                            '   <p class="err-msg" id="err-cst_attic"></p>'+
                            '</div>';
                }
                else if(objArray[i].fields[j] === 'cst_speedtest') {
                    form += '<p class="input-header" id="input-header-cst_speedtest"> CUSTOMER SPEED TEST RESULTS </p>'+
                            '<input id="input-cst_speedtest" type="text" name="cst_speedtest"/>';
                }
                else if(objArray[i].fields[j] === 'cst_torch') {
                    form += '<p class="input-header" id="input-header-cst_torch"> CUSTOMER TORCH RESULTS </p>'+
                            '<input id="input-cst_torch" type="text" name="cst_torch"/>';
                }
                else if(objArray[i].fields[j] === 'radio_management') {
                    form += '<p class="input-header" id="input-header-cst-id"> RADIO MANAGEMENT IP </p>'+
                            '<input id="input-radio_management" type="text" name="radio_management"/>'+
                            '<div class="err-container">'+
                                '<p class="err-msg" id="err-radio_management"></p>'+
                            '</div>';
                }
                else if(objArray[i].fields[j] === 'radio_public') {
                    form += '<p class="input-header" id="input-header-radio_public"> RADIO PUBLIC IP </p>'+
                            '<input id="input-radio_public" type="text" name="radio_public"/>'+
                            '<div class="err-container">'+
                                '<p class="err-msg" id="err-radio_public"></p>'+
                            '</div>';
                }
                else if(objArray[i].fields[j] === 'radio_mac') {
                    form += '<p class="input-header" id="input-header-radio-mac"> RADIO MAC ADDRESS </p>'+
                            '<input id="input-radio_mac" type="text" name="radio_mac"/>'+
                            '<div class="err-container">'+
                                '<p class="err-msg" id="err-radio_mac"></p>'+
                            '</div>';
                }
                else if(objArray[i].fields[j] === 'radio_speedtest') {
                    form += '<p class="input-header" id="input-header-radio_speedtest"> RADIO SPEED TEST RESULTS </p>'+
                            '<input id="input-radio_speedtest" type="text" name="radio_speedtest"/>';
                }
                else if(objArray[i].fields[j] === 'radio_type') {
                    form += '<p class="input-header" id="input-header-radio_type"> RADIO TYPE </p>'+
                            '<div class="input-group" id="input-group-radio_type">'+
                                '<select id="input-radio_type">'+
                                    '<option value=""></option>'+
                                    '<option value="UBNT"> UBNT </option>'+
                                    '<option value="EPMP"> ePMP </option>'+
                                    '<option value="CANOPY"> Canopy </option>'+
                                    '<option value="TELRAD"> LTE - Telrad </option>'+
                                '</select>'+
                                '<select id="input-radio_type_type">'+
                                '</select>'+
                            '</div>'+
                            '<div class="err-container">'+
                                '<p class="err-msg" id="err-radio_type"></p>'+
                            '</div>'
                }
                else if(objArray[i].fields[j] === 'radio_signal') {
                    form += '<p class="input-header" id="input-header-radio_signal"> RADIO SIGNAL STRENGTH </p>'+
                            '<input id="input-radio_signal" type="text" name="radio_signal"/>'
                }
                else if(objArray[i].fields[j] === 'radio_signal_last') {
                    form += '<p class="input-header" id="input-header-radio_signal_last"> LAST KNOWN SIGNAL STRENGTH </p>'+
                            '<input id="input-radio_signal_last" type="text" name="radio_signal_last"/>'
                }
                else if(objArray[i].fields[j] === 'radio_ccq') {
                    form += '<p class="input-header" id="input-header-radio_ccq"> RADIO CCQ </p>'+
                            '<input id="input-radio_ccq" type="text" name="radio_ccq"/>'
                }
                else if(objArray[i].fields[j] === 'radio_quality') {
                    form += '<p class="input-header" id="input-header-radio_quality"> RADIO QUALITY / CAPACITY </p>'+
                            '<input id="input-radio_quality" type="text" name="radio_quality"/>'
                }
                else if(objArray[i].fields[j] === 'radio_ssid') {
                    form += '<p class="input-header" id="input-header-radio_ssid"> RADIO SSID </p>'+
                            '<input id="input-radio_ssid" type="text" name="radio_ssid"/>'
                }
                else if(objArray[i].fields[j] === 'radio_ap_count') {
                    form += '<p class="input-header" id="input-header-radio_ap_count"> ACCESS POINT CUSTOMER COUNT </p>'+
                            '<input id="input-radio_ap_count" type="text" name="radio_ap_count"/>'
                }
                else if(objArray[i].fields[j] === 'radio_aggregate') {
                    form += '<p class="input-header" id="input-header-radio-aggregate"> RADIO AGGREGATE </p>'+
                            '<input id="input-radio_aggregate" type="text" name="radio_aggregate"/>'+
                            '<div class="err-container">'+
                                '<p class="err-msg" id="err-radio_aggregate"></p>'+
                            '</div>';
                }
                else if(objArray[i].fields[j] === 'router_mac') {
                    form += '<p class="input-header" id="input-header-router-mac"> ROUTER MAC ADDRESS </p>'+
                            '<input id="input-router_mac" type="text" name="router_mac"/>'+
                            '<div class="err-container">'+
                                '<p class="err-msg" id="err-router_mac"></p>'+
                            '</div>';
                }
                else if(objArray[i].fields[j] === 'voip_mac') {
                    form += '<p class="input-header" id="input-header-voip_mac"> VOIP ADAPTER MAC ADDRESS </p>'+
                            '<input id="input-voip_mac" type="text" name="voip_mac"/>'+
                            '<div class="err-container">'+
                                '<p class="err-msg" id="err-voip_mac"></p>'+
                            '</div>';
                }
                else if(objArray[i].fields[j] === 'voip_public') {
                    form += '<p class="input-header" id="input-header-voip_public"> VOIP ADAPTER PUBLIC IP </p>'+
                            '<input id="input-voip_public" type="text" name="voip_public"/>'+
                            '<div class="err-container">'+
                                '<p class="err-msg" id="err-voip_public"></p>'+
                            '</div>';
                }
                else if(objArray[i].fields[j] === 'voip_first') {
                    form += '<p class="input-header" id="input-header-voip_first"> IS THE VOIP ADAPTER PLUGGED IN FIRST? </p>'+
                            '<input id="input-voip_first-yes" type="radio" name="voip_first" value="Yes"> Yes <br>'+
                            '<input id="input-voip_first-no" type="radio" name="voip_first" value="No"> No';
                }
                else if(objArray[i].fields[j] === 'voip_registered') {
                    form += '<p class="input-header" id="input-header-voip_registered"> IS THE VOIP ADAPTER IN A REGISTERED STATE? </p>'+
                            '<input id="input-voip_registered-yes" type="radio" name="voip_registered" value="Yes"> Yes <br>'+
                            '<input id="input-voip_registered-no" type="radio" name="voip_registered" value="No"> No';
                }
                else if(objArray[i].fields[j] === 'voip_line') {
                    form += '<p class="input-header" id="input-header-voip_line"> IS THE PHONE PLUGGED INTO LINE 1? </p>'+
                            '<input id="input-voip_line-yes" type="radio" name="voip_line" value="Yes"> Yes <br>'+
                            '<input id="input-voip_line-no" type="radio" name="voip_line" value="No"> No';
                }
                else if(objArray[i].fields[j] === 'voip_paid') {
                    form += '<p class="input-header" id="input-header-voip_paid"> IS THE CUSTOMER CURRENTLY PAYING FOR VOIP? </p>'+
                            '<input id="input-voip_paid-yes" type="radio" name="voip_paid" value="Yes"> Yes <br>'+
                            '<input id="input-voip_paid-no" type="radio" name="voip_paid" value="No"> No';
                }
                else if(objArray[i].fields[j] === 'voip_assignment') {
                    form += '<p class="input-header" id="input-header-voip_assignment"> NUMBER ASSIGNMENT </p>'+
                            '<input id="input-voip_assignment-new" type="radio" name="voip_assignment" value="New"> New <br>'+
                            '<div>'+ 
                                '<input id="input-voip_assignment-ported" type="radio" name="voip_assignment" value="Ported"> Ported <br>'+
                                '<input style="margin-top:10px;" disabled="true" placeholder="Correct email address..." id="input-cst_email" type="text" name="cst_email"/>'+
                            '</div>';
                            
                }
                else if(objArray[i].fields[j] === 'voip_callid') {
                    form += '<p class="input-header" id="input-header-voip_callid"> CALLER ID FOR OUTBOUND CALLS </p>'+
                            '<input id="input-voip_callid" placeholder="Maximum 15 characters..." type="text" name="voip_callid"/>'+
                            '<div class="err-container">'+
                                '<p class="err-msg" id="err-voip_callid"></p>'+
                            '</div>';
                }
                else if(objArray[i].fields[j] === 'tkt_reason_static') {
                    form += '<p class="input-header" id="input-header-tkt_reason_static"> REASON FOR STATIC IP </p>'+
                            '<input id="input-tkt_reason_static" placeholder="Cameras, Gaming, VPN, etc." type="text" name="tkt_reason_static">'+
                            '<div class="err-container">'+
                                '<p class="err-msg" id="err-tkt_reason_static"></p>'+
                            '</div>'
                }
                else if(objArray[i].fields[j] === 'mtl_id') {
                    form += '<p class="input-header" id="input-header-mtl_id"> MTL OR MDU SONAR ID </p>'+
                            '<input id="input-mtl_id" type="text" name="mtl_id"/>'+
                            '<div class="err-container">'+
                            '   <p class="err-msg" id="err-mtl_id"></p>'+
                            '</div>';
                }
                else if(objArray[i].fields[j] === 'mtl_mac') {
                    form += '<p class="input-header" id="input-header-mtl_mac"> VISP MAC ADDRESS (IF ANY)</p>'+
                            '<input id="input-mtl_mac" type="text" name="mtl_mac"/>'+
                            '<div class="err-container">'+
                                '<p class="err-msg" id="err-mtl_mac"></p>'+
                            '</div>';
                }
                else if(objArray[i].fields[j] === 'mtl_dhcp') {
                    form += '<p class="input-header" id="input-header-mtl_dhcp"> IS THE CUSTOMER CURRENTLY IN THE DHCP </br> SERVER AND ARP TABLE? </p>'+
                            '<select id="input-mtl_dhcp">'+
                                '<option value=""> </option>'+
                                '<option value="No"> No </option>'+
                                '<option value="Yes"> Yes </option>'+
                            '</select>';
                }
                else if(objArray[i].fields[j] === 'mtl_queue') {
                    form += '<p class="input-header" id="input-header-mtl_queue"> IS THE CUSTOMER CURRENTLY IN THE </br> QUEUE LIST? </p>'+
                            '<select id="input-mtl_queue">'+
                                '<option value=""> </option>'+
                                '<option value="No"> No </option>'+
                                '<option value="Yes"> Yes </option>'+
                            '</select>';
                }
                else if(objArray[i].fields[j] === 'mtl_queue_max') {
                    form += '<p class="input-header" id="input-header-mtl_queue_max"> WHAT COLOR IS THE CUSTOMER SHOWING </br> UNDER THE QUEUE LIST? </p>'+
                            '<select id="input-mtl_queue_max">'+
                                '<option value=""> </option>'+
                                '<option value="Red"> Red </option>'+
                                '<option value="Yellow"> Yellow </option>'+
                                '<option value="Green"> Green </option>'+
                            '</select>';
                }
                else if(objArray[i].fields[j] === 'mtl_ap') {
                    form += '<p class="input-header" id="input-header-mtl_ap"> WHAT AP IS THE CUSTOMER CONNECTED TO? </p>'+
                            '<input id="input-mtl_ap" type="text" name="mtl_ap"/>'
                }
                else if(objArray[i].fields[j] === 'mtl_ap_uptime') {
                    form += '<p class="input-header" id="input-header-mtl_ap_uptime"> HOW LONG HAS THE AP BEEN UP? </p>'+
                            '<input id="input-mtl_ap_uptime" type="text" name="mtl_ap_uptime"/>'
                }
                else if(objArray[i].fields[j] === 'mtl_snr') {
                    form += '<p class="input-header" id="input-header-mtl_snr"> IS THE SNR ABOVE 20? </p>'+
                            '<select id="input-mtl_snr">'+
                                '<option value=""> </option>'+
                                '<option value="No"> No </option>'+
                                '<option value="Yes"> Yes </option>'+
                            '</select>';
                }
                else if(objArray[i].fields[j] === 'special_equipment') {
                    form += '<p class="input-header" id="input-header-special_equipment"> SPECIAL EQUIPMENT NEEDED </p>'+
                            '<textarea id="input-special_equipment" rows="6" placeholder="Does the technician need specific Gtek equipment, for example, a managed router? Leave blank if not required."></textarea>'+
                            '<div class="err-container">'+
                                '<p class="err-msg" id="err-special_equipment"></p>'+
                            '</div>'
                }
                else if(objArray[i].fields[j] === 'tkt_reason') {
                    form += '<p class="input-header" id="input-header-tkt_reason"> REASON FOR ESCALATION </p>'+
                            '<textarea id="input-tkt_reason" rows="6" placeholder="Why are you creating this ticket? Please provide specific details!"></textarea>'+
                            '<div class="err-container">'+
                                '<p class="err-msg" id="err-tkt_reason"></p>'+
                            '</div>'
                }
                else if(objArray[i].fields[j] === 'tkt_notes') {
                    form += '<p class="input-header" id="input-notes-header"> NOTES / PROBLEM </p>'+
                            '<textarea id="input-tkt_notes" rows="6" placeholder="What was the problem the customer was reporting? What was done on the call? Include the customer\'s attitude."></textarea>';
                }
                else if(objArray[i].fields[j] === 'info_confirm_install') {
                    form += '<p class="input-header" id="input-header-info_confirm_install"> MAKE SURE ALL IS COMPLETED: </p><br>'+
                            '<p class="input-info"> Advised customer the Static IP is <br> recommended when gaming or using <br> cameras. </p>'+
                            '<p class="input-info"> Standard installation process explained. </p>'+
                            '<p class="input-info"> Confirmed that the account holder will be <br> onsite for the install. </p>'+
                            '<p class="input-info"> Customer is informed that we need a <br> confirmation before a tech is dispatched. </p>'+
                            '<p class="input-info"> Advised that any animals onsite must be <br> contained. </p>'+
                            '<p class="input-info"> Advised that the only forms of payment <br> accepted are Money Order, Credit Card, and <br> Debit Card at the time of installation. </p><br>'+
                            '<label class="checkbox-container"><input id="input-info_confirm_install" type="checkbox" name="info_confirm_install" value="CONFIRMED"/> Done </label>';

                }
                else if(objArray[i].fields[j] === 'info_confirm_relo') {
                    form += '<p class="input-header" id="input-header-info_confirm_relo"> MAKE SURE ALL IS COMPLETED: </p><br>'+
                            '<p class="input-info"> Confirmed that the account holder will be <br> onsite for the job. </p>'+
                            '<p class="input-info"> Customer is informed that we need a <br> confirmation before a tech is dispatched. </p>'+
                            '<p class="input-info"> Advised that any animals onsite must be <br> contained. </p>'+
                            '<p class="input-info"> Date will be set on the disconnect job <br> created once submitted. </p>'+
                            '<p class="input-info"> Date will be set on the installation job <br> created once submitted. </p>'+
                            '<label class="checkbox-container"><input id="input-info_confirm_relo" type="checkbox" name="info_confirm_relo" value="CONFIRMED"/> Done </label>';

                }
                else if(objArray[i].fields[j] === 'info_confirm_survey') {
                    form += '<p class="input-header" id="input-header-info_confirm_survey"> MAKE SURE ALL IS COMPLETED: </p><br>'+
                            '<p class="input-info"> Site Survey is approved by supervisor. </p>'+
                            '<p class="input-info"> Advised that any animals onsite must be <br> contained. </p>'+
                            '<label class="checkbox-container"><input id="input-info_confirm_survey" type="checkbox" name="info_confirm_relo" value="CONFIRMED"/> Done </label>';
                }
                else
                    console.error('Specified field id not found!');
            }
            form += '</div>';
        }           

        // Create "CLEAR" and "SUBMIT" buttons
        form += '<div class="btn-container" id="btn-container-tkt-submit">'+
                    '<input type="button" class="btn-tkt" value="CLEAR" id="btn-tkt-clear"/>'+
                    '<input type="button" class="btn-tkt" value="SUBMIT" id="btn-tkt-submit"/>'+
                '</div>'+
                '<br>'+
                '<div class="err-container">'+
                    '<p class="err-msg" id="err-submit"></p>'+
                '</div>'+
                '<div class="err-container">'+
                    '<p class="success-msg" id="succ-submit"></p>'+
                '</div>';

        form += '</div>';

        form += '<div class="alert-block-hidden" id="alert-block-clear">'+
                    '<h1> Are you sure you want to clear the ticket? </h1>'+
                    '<div class="btn-container" id="btn-container-tkt-clear">'+
                        '<input type="button" class="btn-tkt" value="CLEAR" id="btn-clear-confirmation-clear"/>'+
                        '<input type="button" class="btn-tkt" value="CANCEL" id="btn-clear-confirmation-cancel"/>'+
                    '</div>'+
                '</div>';

        form += '<div class="alert-block-hidden" id="alert-block-submit">'+
                    '<h1 id="alert-submit-text"> Are you sure you want to submit the ticket?</h1>'+
                    '<br>'+
                    '<div class="btn-container" id="btn-container-tkt-submit">'+
                        '<input type="button" class="btn-tkt" value="SUBMIT" id="btn-submit-confirmation-submit"/>'+
                        '<input type="button" class="btn-tkt" value="CANCEL" id="btn-submit-confirmation-cancel"/>'+
                    '</div>'+
                '</div>';
        
        form += '<div class="alert-block-hidden" id="alert-block-submission">'+
                    '<h1 id="alert-submission-text"></h1>'+
                    '<h1 id="alert-submission-err"></h1>'+
                    '<br>'+
                    '<div class="btn-container" id="btn-container-tkt-submission">'+
                        '<input type="button" class="btn-tkt" value="OKAY" id="btn-submission-close"/>'+
                    '</div>'+
                '</div>';

        // Append generated form
        $('section#'+section+' '+identifier).append(form);
        if(!this._customer_search) {
            $('#input-ticket-template').removeClass('input-block-hidden').addClass('input-block-container');
        }
    }

    /**
     * Creates an ID from the passed in string
     * by removing any spaces and converting to 
     * lowercase.
     * 
     * @param {*} string 
     */
    this._createID = function(string)
    {
        let id = string.toLowerCase();
        id = id.replace(/\s/g, '-');
        return id;
    }
}