let Sonar = new function()
{
    let https = require('https');

    this.options = {
        host: 'gtek.sonar.software',
        path: '',
        headers: '',
        method: 'GET'
    }

    /**
     * This tests the username and password entered by the user.
     */
    this.Authenticate = function(username, password, callback) 
    {
        this.options.path = '/api/v1/users';
        this.options.headers = {'Authorization': 'Basic ' + new Buffer(username+':'+password).toString('base64')};
        this.options.method = 'GET';
        this.callback = callback;

        this.getData(this.options, this.callback);
    }

    /**
     * Handles the login of the user.
     * @param {*} data 
     */
    this.HandleLogin = function(data, callback)
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
                this.HandleLogin(data, callback);
            });

        }).end();
    }
};

module.exports = Sonar;