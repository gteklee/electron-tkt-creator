/**
 * Home Object. Each function relative to the home page
 * is stored in this object. Listeners then use the
 * home object to make appropriate function calls.
 * 
 * Functions:
 * 
 * Login() :: void
 */
let Home = new function()
{
    /**
     * Login property that deals with allowing the
     * user to log into the application.
     * 
     * Functions:
     * login(string, string)                    :: void
     * checkUsernamePassword(string, string)    :: void
     * checkUsername(string)                    :: void
     * displayError(string)                     :: void
     * resetError(string)                       :: void
     */
/**/this.Login = new function()
    {
        this.username = ''; // username: string.
        this.password = ''; // password: string.
        this.name = ''; // name of the user: string
        this.errorMsg = ''; // error message to be displayed: string.

        this.loggedIn = false; // is user logged in?: bool
        this.error = false; // does an error exist with log in?: bool

        /**
         * Logs the user in by sending a test GET request to
         * the Sonar API with the entered username and password
         * as the authentication. 
         * 
         * If successful, then the user is informed that they are
         * logged in.
         * 
         * If anything fails, then they are provided the
         * appropriate error message - typically "incorrect
         * username or password".
         * 
         * @param {*} username 
         * @param {*} password 
         */
        this.login = function(username, password)
        {
            this.user = username;
            this.pass = password;
            this.Sonar = require('../server/Sonar.js');

            // Authenticates and logs the user in if successful with username and password.
            this.Sonar.Login.Authenticate(this.user, this.pass, (data) => {

                if(data.error)
                {
                    this.error = true;
                    
                    if(data.error.status_code == 401)
                        this.errorMsg = 'Incorrect username or password!';
                    else
                        this.errorMsg = 'Inform Admin of Error Code ' + data.error.status_code + '!';

                    this.displayError('#err-login');
                }
                else
                {
                    console.log('Success! ', data);
                    this.name = this.getName(username, data);
                    this.loggedIn = true;
                    this.welcomeUser();
                    this.createSession();
                }
            });

            /**
             * Once the user is successfully logged in, get the
             * public name of the user to inform them they
             * successfully logged in.
             * @param {*} username 
             * @param {*} data 
             */
            this.getName = function(username, data)
            {
                for(let i = 0; i < data.data.length; i++)
                    if(data.data[i].username == username)
                        return data.data[i].public_name;
            }
        }

        /**
         * Utilizes the username, password, and loggedIn
         * variables to create a session state for the user.
         */
        this.createSession = function()
        {
            sessionStorage.username = this.username;
            sessionStorage.password = this.password;
            sessionStorage.name = this.name;
            sessionStorage.loggedIn = this.loggedIn;
        }

        this.welcomeUser = function()
        {
            $('#input-block-log-in').removeClass('input-block').addClass('input-block-hidden');
            $('#input-block-logged-in').removeClass('input-block-hidden').addClass('input-block');
            $('.login-success').text('Welcome, ' + this.name + '!');
        }

        /**
         * Checks the username and password entered by the user
         * when the login button is pressed.
         * @param {*} username 
         * @param {*} password 
         */
        this.checkUsernamePassword = function(username, password)
        {
            this.username = username;   // string value entered as username.
            this.password = password;   // string value entered as password.

            // check any errors with username / password entered.
            if(this.username == '' || this.password == '')  // check if blank.
            {
                this.error = true;
                this.errorMsg = 'Username or Password cannot be blank!';
            }
            else // if no errors
                this.resetError('#err-login');

            if(this.error)
            {
                this.displayError('#err-login');
                return;
            }

            this.login(this.username, this.password);
        }

        /**
         * Checks the username on the key up event.
         * This is used to inform the user of any error
         * while they are typing. "Live error checkin".
         * @param {*} username 
         */
        this.checkUsername = function(username)
        {
            this.username = username;

            if(this.username.indexOf(' ') >= 0) // check for any whitespace
            {
                this.error = true;
                this.errorMsg = 'Username cannot contain whitespace!';
            }
            else if(this.username.match(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/\s]/gi))
            {
                this.error = true;
                this.errorMsg = 'Username contains invalid characters!';
            }
            else if(this.username.match(/[A-Z]/))
            {
                this.error = true;
                this.errorMsg = 'Username contains uppercase characters!';
            }
            else
                this.resetError('#err-username');

            if(this.error)
                this.displayError('#err-username');

        }

        /**
         * If there is an error and this function is called,
         * then the error message is displayed to the user.
         * @param {*} id -> element location of error message
         */
        this.displayError = function(id)
        {
            if(this.error)
                $(id).text(this.errorMsg);
        }

        /**
         * Resets error message when error is resolved.
         * @param {*} id -> element location of error message.
         */
        this.resetError = function(id)
        {
            this.error = false;
            this.errorMsg = '';
            $(id).text('');
        }

    }

    /**
     * 
     */
/**/
};

/**
 * Login button-clicked listener
 */
$('#btn-home-login').on('click', () => {
    if(!Home.error)
        Home.Login.checkUsernamePassword($('#input-login-username').val(), $('#input-login-password').val());
    else
        Home.Login.displayError();
});

/**
 * User typing in username listener
 */
$('#input-login-username').keyup(() => {
    Home.Login.checkUsername($('#input-login-username').val());
});

/**
 * When the update is ready, inform the user and provide
 * the option to install the new update.
 */
const ipcRenderer = require('electron').ipcRenderer;
ipcRenderer.on('updateReady', (event, text) => {
    alert("Update is available!");
});

/**
 * When page loads, check if session is still available and
 * update elements accordingly.
 */
$(window).on('load', () => {
    if(sessionStorage.loggedIn)
    {
        Home.Login.loggedIn = true;
        Home.Login.username = sessionStorage.username;
        Home.Login.password = sessionStorage.password;
        Home.Login.name = sessionStorage.name;
        Home.Login.welcomeUser();
    }
});