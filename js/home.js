const changelog = require('./modules/Changelog');
const sonar = require('./modules/Sonar');
const towers = require('./modules/Towers');
const updates = require('./modules/Updates');

/** ---------------------------------------------------------------------------------- */

let _username = '';
let _password = '';
let _loggedIn = false;
let _name = '';

let _client = null;

let _errorMessage = '';
let _error = false;

let _changelog = false;

// Home object: Home page functionality
const Home = {

    // User authentication
    auth: {

        /**
         * Log the 
         * @param {String} user 
         * @param {String} pass 
         * :VOID:
         */
        login: function(user, pass) {
            if(sessionStorage.loggedIn) {

                // Get login info from local storage
                setLoggedIn(true);
                setUsername(sessionStorage.username);
                setPassword(sessionStorage.password);
                setName(sessionStorage.name);
                setClient(sonar.createClient(getUsername(), getPassword()));
                // console.log(getClient());
                towers.retrieveTowers(getClient());
                Home.message.welcomeUser();
            }
            else {

                // Check if testing storage login
                if(user === undefined || pass === undefined) return;

                // Request via authentication
                sonar.authenticate(user, pass, (json, client) => {
                    if(json.error) { // Problem
                        Home.message.handleError(json.error, '#err-login');
                    }
                    else { // Success
                        console.log(client);
                        setUsername(user);
                        setPassword(pass);
                        createSession(json, client);
                        towers.retrieveTowers(getClient());
                        Home.message.welcomeUser();
                    }
                });
            }
        },

        /**
         * Check if provided username and password
         * is valid.
         * @param {String} user 
         * @param {Password} pass
         * :BOOL:
         */
        isValidUsernamePassword: function(user, pass) {
            if(user == '' || pass == '') {
                setErrorMessage('Username or Password cannot be blank!');
                Home.message.showError('#err-login');
                return false;
            } else {
                Home.message.cancelError('#err-login');
            }
            return true;
        },

        /**
         * Live check username for errors as the user
         * types.
         * @param {String} user
         * :VOID: 
         */
        liveCheckUsername: function(user) {

            // Error check
            if(user.indexOf(' ') >= 0) { // whitespace
                setErrorMessage('Username cannot contain whitespace!');
            }
            else if(user.match(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/\s]/gi)) { // Regex for invalid characters
                setErrorMessage('Username contains invalid characters!');
            }
            else {
                Home.message.cancelError('#err-username');
            }
            
            if(hasError()) { // Show error if any
                Home.message.showError('#err-username');
            }
        }
    },

    // UI message system
    message: {

        /**
         * Welcome the user with their username.
         * :VOID:
         */
        welcomeUser: function() {
            $('#input-block-log-in').removeClass('input-block').addClass('input-block-hidden');
            $('#input-block-logged-in').removeClass('input-block-hidden').addClass('input-block');
            $('.login-success').text('Welcome, ' + getName() + '!');
        },

        /**
         * handle any error.
         * @param {Object} err 
         * @param {String} id
         * :VOID:
         */
        handleError: function(err, id) {

            // Check error status
            if(err.status_code == 401) {
                setErrorMessage('Incorrect username or password!');
            } else {
                setErrorMessage('Possible permissions error: Error Code ' + err.status_code + '!');
            }

            // Show error
            Home.message.showError(id);
        },

        /**
         * Display current error to user.
         * @param {String} id
         * :VOID:
         */
        showError: function(id) {
            if(hasError()) {
                $(id).text(getErrorMessage());
            }
        },

        /**
         * Remove error from element and reset error
         * status.
         * @param {String} id
         * :VOID: 
         */
        cancelError: function(id) {
            resetError();
            $(id).text('');
        }
    },

    // Changelog UI system
    changelog: {

        /**
         * Hide the changelog UI.
         * :VOID:
         */
        hide: function() {

            // Hide all changelog elements
            setChangelogDisplayed(false);
            $('#input-block-changelog').removeClass('input-block');
            $('#input-block-changelog').addClass('input-block-hidden');
            $('.changelog-description h1').remove();
            $('.changelog-description p').remove();

            // Check what to show after hiding changelog
            if(isLoggedIn()) { // User logged in
                $('#input-block-logged-in').removeClass('input-block-hidden');
                $('#input-block-logged-in').addClass('input-block');
            } else { // Not logged in
                $('#input-block-log-in').removeClass('input-block-hidden');
                $('#input-block-log-in').addClass('input-block');
            }
        },

        /**
         * Show the changelog UI.
         * :VOID:
         */
        show: function() {

            // Instead of checking is user is logged in or not,
            // just hide both blocks
            $('#input-block-log-in').removeClass('input-block');
            $('#input-block-log-in').addClass('input-block-hidden');
            $('#input-block-logged-in').removeClass('input-block');
            $('#input-block-logged-in').addClass('input-block-hidden');

            // Show changelog block
            $('#input-block-changelog').removeClass('input-block-hidden');
            $('#input-block-changelog').addClass('input-block');

            // Show information
            for(let obj in changelog) {
                $('.changelog-description').append('<h1> ' + changelog[obj].name + ' </h1>');
                for(let i = 0; i < changelog[obj].description.length; i++) {
                    $('.changelog-description').append('<p> ' + changelog[obj].description[i] + '</p>');
                }
            }

            setChangelogDisplayed(true);
        },

        /**
         * Is the changelog currently showing?
         * :BOOL:
         */
        isDisplayed: function() {
            return isChangelogBeingDisplayed();
        }
    }
};



/** ---------------------------------------------------------------------------------- */



/**
 * Set username.
 * @param {String} user
 * :VOID: 
 */
function setUsername(user) {
    _username = user;
}

/**
 * Get current username.
 * :STRING:
 */
function getUsername() {
    return _username;
}

/**
 * Set password.
 * @param {String} pass 
 * :VOID:
 */
function setPassword(pass) {
    _password = pass;
}

/**
 * Get current password.
 * :STRING:
 */
function getPassword() {
    return _password;
}

/**
 * Set logged in status.
 * @param {Boolean} bool 
 * :VOID:
 */
function setLoggedIn(bool) {
    _loggedIn = bool;
}

/**
 * Is the user logged in?
 * :BOOL:
 */
function isLoggedIn() {
    return _loggedIn;
}

/**
 * Set name.
 * @param {String} name 
 * :VOID:
 */
function setName(name) {
    _name = name;
}

/**
 * Get current name.
 * :STRING:
 */
function getName() {
    return _name;
}

/**
 * Get name from Json data.
 * @param {Object} json 
 * :STRING:
 */
function getNameFromJson(json) {
    for(let i = 0; i < json.data.length; i++) {
        if(json.data[i].username.toLowerCase() == getUsername().toLowerCase()) {
            return json.data[i].public_name;
        }
    }
}

/**
 * Set the sonar client to be used in the
 * session.
 * @param {Object} client 
 */
function setClient(client) {
    _client = client;
}

/**
 * Get the current sonar client.
 * :OBJECT:
 */
function getClient() {
    return _client;
}

/**
 * Create the current session and store it for
 * reload.
 * @param {Object} json 
 * @param {Object} client 
 */
function createSession(json, client) {
    setLoggedIn(true);
    setName(getNameFromJson(json));
    setClient(client);
    sessionStorage.username = getUsername();
    sessionStorage.password = getPassword();
    sessionStorage.name = getName();
    sessionStorage.client = getClient();
    sessionStorage.loggedIn = isLoggedIn();
}

/**
 * Set the error status.
 * @param {Boolean} bool 
 * :VOID:
 */
function setError(bool) {
    _error = bool;
}

/**
 * Check error status.
 * :BOOL:
 */
function hasError() {
    return _error;
}

/**
 * Set the error message to by displayed.
 * Automatically sets error to true.
 * @param {String} msg 
 * :VOID:
 */
function setErrorMessage(msg) {
    setError(true);
    _errorMessage = msg;
}

/**
 * Get the current error message.
 * :STRING:
 */
function getErrorMessage() {
    return _errorMessage;
}

/**
 * Reset error to none.
 * :VOID:
 */
function resetError() {
    setError(false);
    setErrorMessage('');
}

/**
 * Set if changelog should be displayed or not.
 * @param {Boolean} bool 
 * :VOID:
 */
function setChangelogDisplayed(bool) {
    _changelog = bool;
}

/**
 * Is the changelog being displayed?
 * :BOOL:
 */
function isChangelogBeingDisplayed() {
    return _changelog;
}

/**
 * Show the current application version on the UI.
 * :VOID:
 */
function setVersion() {
    for(let obj in changelog) {
        $('#version').text(changelog[obj].name);
        break;
    } // End after first object
}



/** ---------------------------------------------------------------------------------- */

/**
 * User typing username.
 * :EVENT KEYUP:
 */
$('#input-login-username').keyup(() => {
    Home.auth.liveCheckUsername($('#input-login-username').val());
});

/**
 * Login button clicked.
 * :EVENT CLICK:
 */
$('#btn-home-login').on('click', () => {
    let user = $('#input-login-username').val();
    let pass = $('#input-login-password').val();
    if(Home.auth.isValidUsernamePassword(user, pass)) {
        Home.auth.login(user, pass);
    }
});

/**
 * Changelog back button clicked.
 * :EVENT CLICK:
 */
$('#btn-changelog-back').on('click', () => {
    Home.changelog.hide();
});

/**
 * Version clicked.
 */
$('#version').on('click', () => {
    if(updates.isUpdateReady()) {
        updates.update();
    } else {
        // Changelog is already showing.
        if(Home.changelog.isDisplayed()) return;

        Home.changelog.show();
    }
});

/**
 * On enter key pressed, click login button.
 */
$(window).on('keydown', (e) => {
    if(e.keyCode === 13 && !isLoggedIn())
        $('#btn-home-login').click();
});

/**
 * On load event set version and attempt to
 * login.
 * 
 * :EVENT LOAD:
 */
$(() => {
    setVersion(); // Set current version of app
    Home.auth.login(); // Attempt to login
});