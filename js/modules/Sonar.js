const sonar = require('node-sonar-api');

const _host = require('../../server/keys').URI;

module.exports = {

    // Ticket options
    ticket: {

        /**
         * Submit ticket to Sonar by creating a new job on account.
         * @param {Number} id 
         * @param {String} template 
         * @param {Number} tkt_id 
         * @param {Number} job_type_id 
         * @param {Object} client 
         * @param {Function} callback 
         */
        submitAsJob: function(id, template, tkt_id, job_type_id, client, callback) {
            // Check if ticket id provided
            let obj;
            if(tkt_id) {
                obj = {
                    job_type_id: job_type_id,
                    assigned_type: "accounts",
                    assigned_id: id,
                    notes: template,
                    ticket_id: tkt_id
                };
            } else {
                obj = {
                    job_type_id: job_type_id,
                    assigned_type: "accounts",
                    assigned_id: id,
                    notes: template
                };
            }
            // Make request
            client.create.Job(obj)
                .then(json => { callback(json) });
        },

        /**
         * Submit ticket to Sonar by creating a new ticket.
         * @param {Number} id 
         * @param {String} template 
         * @param {String} subject 
         * @param {Number} group_id 
         * @param {Number} cat_id 
         * @param {Object} client 
         * @param {Function} callback 
         */
        submitAsTicket: function(id, template, subject, group_id, cat_id, client, callback) {
            let obj = {}; // Init object
            let arr = []; // Init array
            arr.push(cat_id);
            // If customer id specified
            if(id) {
                obj = {
                    subject: subject,
                    type: "internal",
                    ticket_group_id: group_id,
                    assignee: 'accounts',
                    assignee_id: id,
                    category_ids: arr,
                    comment: template
                }
            } else {
                obj = {
                    subject: subject,
                    type: 'internal',
                    ticket_group_id: group_id,
                    category_ids: arr,
                    comment: template
                }
            }
            // Make request
            client.create.Ticket(obj)
                .then(json => { callback(json) });
        },

        // updateCustomFields: function(obj, data, client, callback) {

        // }
    },

    // Customer account options
    customer: {

        /**
         * Get the customer's account from Sonar by id.
         * @param {Number} id 
         * @param {Object} client 
         * @param {Function} callback 
         */
        getAccount: function(id, client, callback) {
            client.get.Account(id)
                .then(json => { callback(json) });
        },

        /**
         * Get a customer's ip assignments from Sonar by id.
         * @param {Number} id 
         * @param {Object} client 
         * @param {Function} callback 
         */
        getAccountIpAssignments: function(id, client, callback) {
            client.getAll.account.ipAssignments(id)
                .then(json => { callback(json) });
        },

        /**
         * Get a specific inventory item by its id.
         * @param {Number} id 
         * @param {Object} client 
         * @param {Function} callback 
         */
        getInventoryItemById: function(id, client, callback) {
            client.get.inventory.item(id)
                .then(json => { callback(json) });
        },

        /**
         * Get all services on a customer account by id.
         * @param {Number} id 
         * @param {Object} client 
         * @param {Function} callback 
         */
        getAccountServicesById: function(id, client, callback) {
            client.getAll.account.services(id)
                .then(json => { callback(json) });
        }
    },
    
    /**
     * Attempt to make a request to the Sonar API with
     * the user/pass combo provided. If successful return
     * the client object.
     * 
     * @param {String} user 
     * @param {String} pass 
     * @param {Function} cb 
     */
    authenticate: function(user, pass, cb) {
        
        // Create sonar client
        let client = sonar.createClient({
            sonarHost: _host,
            sonarUsername: user,
            sonarPassword: pass
        });
        
        // Attempt to get all users
        client.getAll.users()
            .then(json => {
                if(json.error) { // Error
                    cb(json, null);
                } else {
                    cb(json, client);
                }
            });
    },

    /**
     * Create client api with username and password.
     * @param {String} user 
     * @param {String} pass 
     */
    createClient: function(user, pass) {
        return sonar.createClient({
            sonarHost: _host,
            sonarUsername: user,
            sonarPassword: pass
        });
    }
};