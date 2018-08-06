module.exports = {
    /**
     * Large tickets have the full data object passed
     * while smaller tickets have each input passed
     */
    templates: {
        /**
         * All non-network related tickets.
         * @param {Object} tkt_data
         */
        repair: function(tkt_data)
        {   // Template of required fields
            let template = '<p> Job Type: ' + tkt_data.job_type + '</p>';
            template += '<p>' + tkt_data.cst_name + '<br>';
            template += tkt_data.cst_package[0] + ' ' + tkt_data.cst_package[1] + '</p>';
            template += '<p> Tower: ' + tkt_data.job_tower + '<br>';
            template += 'Zone: ' + tkt_data.job_zone + '</p>';
            template += '<p> Management IP: ' + tkt_data.radio_management + '<br>';
            template += 'Public IP: ' + tkt_data.radio_public + '<br>';
            template += 'MAC Address: ' + tkt_data.radio_mac + '<br>';
            template += 'Radio Type: ' + tkt_data.radio_type[0] + ' ' + tkt_data.radio_type[1] + '<br>';
            // Optional fields
            if(tkt_data.radio_ssid !== '') {
                template += 'SSID: ' + tkt_data.radio_ssid + '<br>';
            }
            if(tkt_data.radio_ap_count !== '') {
                template += 'AP CST Count: ' + tkt_data.radio_ap_count + '<br>';
            }
            if(tkt_data.radio_ccq !== '') {
                template += 'CCQ: ' + tkt_data.radio_ccq + '<br>';
            }
            if(tkt_data.radio_quality !== '') {
                template += 'Qual / Cap: ' + tkt_data.radio_quality + '<br>';
            }
            if(tkt_data.radio_signal !== '') {
                template += 'Radio Signal: ' + tkt_data.radio_signal + '<br>';
            }
            if(tkt_data.radio_signal_last !== '') {
                template += 'Last Known Good Signal: ' + tkt_data.radio_signal_last + '<br>';
            }
            if(tkt_data.radio_speedtest !== '') {
                template += 'Radio Speed Test: ' + tkt_data.radio_speedtest + '</p>';
            }
            if(tkt_data.cst_torch !== '') {
                template += '<p> Torch Results: ' + tkt_data.cst_torch + '<br>';
            }
            else {
                template += '<p>';
            }
            if(tkt_data.cst_speedtest !== '') {
                template += 'CST Speed Test Results: ' + tkt_data.cst_speedtest + '</p>';
            }
            else {
                template += '</p>';
            }
            if(tkt_data.tkt_notes !== '') {
                template += '<p> Notes: ' + tkt_data.tkt_notes + '</p>';
            }
            return template;
        },

        /**
         * All Network Escalation tickets.
         */
        escalations: {

            /**
             * Static Ip Request escalation ticket.
             * 
             * @param {Number} cst_id
             * @param {String} cst_name
             * @param {String} radio_management
             * @param {String} router_mac
             * @param {String} tkt_reason
             * @param {String} tkt_notes (Optional)
             */
            static: function(cst_id, cst_name, radio_management, router_mac, tkt_reason, tkt_notes)
            {
                let template = '<p> Escalating Reason: ' + tkt_reason + '<br>';
                template += 'Date: ' + (new Date().toLocaleDateString()) + '</p>';
                template += '<p> Customer Name: ' + cst_name + '<br>';
                template += 'Customer ID: ' + cst_id + '</p>';
                template += '<p> Managed IP:   ' + radio_management + '<br>';
                template += 'Router MAC Address:  ' + router_mac + '</p>';
                if(tkt_notes) { // Are there any notes included?
                    template += '<p> Notes: ' + tkt_notes + '</p>';
                }
                return template;
            },

            /**
             * Key Upgrade escalation ticket.
             * 
             * @param {String} cst_name
             * @param {Number} cst_id
             * @param {String} radio_management
             * @param {String} radio_mac
             * @param {String} radio_aggregate
             * @param {String} tkt_notes (Optional)
             */
            key_upgrade: function(cst_name, cst_id, radio_management, radio_mac, radio_aggregate, tkt_notes)
            {   // Create ticket from user input. 
                let template = '<p> Escalating Reason: Key Upgrade <br>';
                template += 'Date: ' + (new Date().toLocaleDateString()) + '</p>';
                template += '<p> Customer Name: ' + cst_name + '<br>';
                template += 'Customer ID: ' + cst_id + '</p>';
                template += '<p> Radio IP: ' + radio_management + '<br>';
                template += 'Radio MAC: ' + radio_mac + '<br>';
                template += 'Radio Aggregate: ' + radio_aggregate + '</p>';
                if(tkt_notes) { // Are there any notes included?
                    template += '<p>Notes: ' + tkt_notes + '</p>';
                }
                return template;
            },

            /**
             * VOIP escalation ticket.
             * 
             * @param {Number} cst_id
             * @param {String} cst_name
             * @param {String} cst_status
             * @param {String} voip_mac
             * @param {String} voip_first
             * @param {String} voip_registered
             * @param {String} voip_line
             * @param {String} voip_paid
             * @param {String} voip_assignment
             * @param {String} voip_callid
             * @param {String} tkt_reason
             */
            voip: function(cst_id, cst_name, cst_status, voip_mac, voip_public, voip_first, voip_registered, voip_line, voip_paid, voip_assignment, voip_callid, tkt_reason)
            {
                let template = '<p> Escalating Reason: VOIP / Nextiva <br>';
                template += 'Date: ' + (new Date().toLocaleDateString()) + '</p>';
                template += '<p> Customer Name: ' + cst_name + '<br>';
                // Include ID
                if(cst_status === 'Current Customer') {
                    template += 'Customer ID: ' + cst_id + '</p>';
                } else {
                    template += '</p>';
                }
                template += '<p> Customer Status: ' + cst_status + '<br>';
                template += 'Reason For Escalation: ' + tkt_reason + '</p>';

                template += '<p> VOIP MAC Address:  ' + voip_mac + '<br>';
                template += 'Adapter IP Address: ' + voip_public + '</p>';


                if(cst_status === 'Current Customer') {
                    template += '<p> VOIP plugged in first?: ' + voip_first + '<br>';
                    template += 'VOIP in a registered state?: ' + voip_registered + '<br>';
                    template += 'Phone plugged into line 1?: ' + voip_line + '</p>'; 
                }
                else if(cst_status === 'New Customer') {
                    template += '<p> Is the customer paying for VOIP?: ' + voip_paid + '<br>';
                    template += 'Number assignment?: ' + voip_assignment + '<br>';
                    template += 'Caller ID: ' + voip_callid + '</p>'; 
                }
                else {
                    console.error('cst_status ' + cst_status + ' not found!' );
                }

                return template;
            }
        }
    }
};