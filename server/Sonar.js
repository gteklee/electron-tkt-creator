let Sonar = new function()
{
    let https = require('https');   // https module.

    // Template of GET request options for proper https request.
    let options = {
        host: 'gtek.sonar.software',
        path: '',
        headers: '',
        method: ''
    }

    this.Customer = new function()
    {
        /**
         * Get the customer data from Sonar provided ID.
         * @param {*} id 
         * @param {*} name
         * @param {*} username
         * @param {*} password
         * @param {*} callback
         */
        this.GetCustomer = function(id, username, password, callback)
        {
            options.path = '/api/v1/accounts/' + id;
            options.headers = {'Authorization': 'Basic ' + new Buffer(username+':'+password).toString('base64')};
            options.method = 'GET';
            this.callback = callback;

            this.getData(options, this.callback);
        }

        /**
         * Get the customer ip assignments.
         * @param {*} id 
         * @param {*} username 
         * @param {*} password 
         * @param {*} callback 
         */
        this.GetIPAssignments = function(id, username, password, callback)
        {
            options.path = '/api/v1/accounts/' + id + '/ip_assignments';
            options.headers = {'Authorization': 'Basic ' + new Buffer(username+':'+password).toString('base64')};
            options.method = 'GET';
            this.callback = callback;

            this.getData(options, this.callback);
        }

        /**
         * Get a single inventory item.
         * @param {*} id - of inventory item
         * @param {*} username 
         * @param {*} password 
         * @param {*} callback 
         */
        this.GetInventoryItem = function(id, username, password, callback)
        {
            options.path = '/api/v1/inventory/items/' + id;
            options.headers = {'Authorization': 'Basic ' + new Buffer(username+':'+password).toString('base64')};
            options.method = 'GET';
            this.callback = callback;

            this.getData(options, this.callback);
        }

        /**
         * Get all inventory items.
         * @param {*} id - of user account
         * @param {*} username 
         * @param {*} password 
         * @param {*} callback 
         */
        this.GetInventoryItems = function(id, username, password, callback)
        {
            options.path = '/api/v1/accounts/' + id + '/inventory_items';
            options.headers = {'Authorization': 'Basic ' + new Buffer(username+':'+password).toString('base64')};
            options.method = 'GET';
            this.callback = callback;

            this.getData(options, this.callback);
        }

        /**
         * Get the package/service the customer has on the account.
         * @param {*} id 
         * @param {*} username 
         * @param {*} password 
         * @param {*} callback 
         */
        this.GetServices = function(id, username, password, callback)
        {
            options.path = '/api/v1/accounts/' + id + '/services';
            options.headers = {'Authorization': 'Basic ' + new Buffer(username+':'+password).toString('base64')};
            options.method = 'GET';
            this.callback = callback;

            this.getData(options, this.callback);

        }


        /**
         * This is the actual https request to the Sonar API.
         * @param {*} options 
         * @param {*} callback 
         */
        this.getData = function(options, callback)
        {
            https.request(options, (res) => {
                let body = '';  // body of JSON.

                res.on('data', (chunk) => { // data is received.
                    body += chunk;
                });

                res.on('end', () => { // when finished parsing data.
                    let data = JSON.parse(body);
                    callback(data);
                });

                res.on('error', (e) => {
                    console.log(e.message);
                });

            }).end();
        }
    }

    this.Towers = new function()
    {
        /**
         * Get all towers from Sonar.
         * @param {*} id 
         * @param {*} username 
         * @param {*} password 
         * @param {*} callback 
         */
        this.GetTowers = function(username, password, callback)
        {
            options.path = '/api/v1/network/network_sites';
            options.headers = {'Authorization': 'Basic ' + new Buffer(username+':'+password).toString('base64')};
            options.method = 'GET';
            this.callback = callback;

            this.getData(options, this.callback);
        }
        
        /**
         * Http request to Sonar to retreive data.
         * @param {*} options 
         * @param {*} callback 
         */
        this.getData = function(options, callback)
        {
            https.request(options, (res) => {
                let body = '';  // body of JSON.

                res.on('data', (chunk) => { // data is received.
                    body += chunk;
                });

                res.on('end', () => { // when finished parsing data.
                    let data = JSON.parse(body);
                    callback(data);
                });

            }).end();
        }
    }

    this.Login = new function()
    {
        /**
         * This tests the username and password entered by the user.
         */
        this.Authenticate = function(username, password, callback) 
        {
            options.path = '/api/v1/users';
            options.headers = {'Authorization': 'Basic ' + new Buffer(username+':'+password).toString('base64')};
            options.method = 'GET';
            this.callback = callback;

            this.getData(options, this.callback);
        }

        /**
         * Handles the login of the user.
         * @param {*} data
         * @param {*} callback
         */
        this.handleLogin = function(data, callback)
        {
            this.data = data;
            callback(this.data);
        }

        /**
         * This is the actual https request to the Sonar API.
         * @param {*} options 
         * @param {*} callback 
         */
        this.getData = function(options, callback)
        {
            https.request(options, (res) => {
                let body = ''; // body of JSON.

                res.on('data', (chunk) => { // when data is received.
                    body += chunk;
                });

                res.on('end', () => {   // when finished parsing data.
                    let data = JSON.parse(body);
                    this.handleLogin(data, callback);
                });

            }).end();
        }
    }

    this.Ticket = new function()
    {
        /**
         * Submit ticket to Sonar by creating a new job on the given account.
         */
        this.Submit = function(id, template, username, password, callback)
        {
            this.callback = callback;

            this.postData(id, template, username, password, this.callback);
        }

        this.postData = function(id, template, username, password, callback)
        {
            let postData = JSON.stringify(
                {
                    job_type_id: 2,
                    assigned_id: id,
                    assigned_type: 'accounts',
                    notes: template
                }
            );

            options.path = '/api/v1/scheduling/jobs';
            options.headers = {
                'Authorization': 'Basic ' + new Buffer(username+':'+password).toString('base64'),
                'Content-Type': 'application/json',
                'Content-Length': postData.length
            };
            options.method = 'POST';

            //callback(template, apiData);
            console.log(postData);

            let req = https.request(options, (res) => {
                let body = '';

                res.on('data', (chunk) => {
                    body += chunk;
                });

                res.on('end', () => {
                    callback(JSON.parse(body));
                });
            });

            req.on('error', (e) => {
                console.log('ERROR w/ POST: ' + e.message);
                callback('error');
            });

            req.write(postData);
            req.end();
        }
    }
};

module.exports = Sonar;