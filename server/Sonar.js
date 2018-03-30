let Sonar = new function()
{
    let https = require('https');   // https module.

    // Template of GET request options for proper https request.
    let options = {
        host: 'gtek.sonar.software',
        path: '',
        headers: '',
        method: 'GET'
    }

    this.Customer = new function()
    {
        /**
         * Get the user data from Sonar provided ID and NAME.
         * @param {*} id 
         * @param {*} name
         * @param {*} username
         * @param {*} password
         * @param {*} callback
         */
        this.GetCustomer = function(id, name, username, password, callback)
        {
            options.path = '';
            options.headers = {'Authorization': 'Basic ' + new Buffer(username+':'+password).toString('base64')};
            optoins.method = 'GET';
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
};

module.exports = Sonar;