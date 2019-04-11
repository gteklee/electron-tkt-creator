const ipcRenderer = require('electron').ipcRenderer;

let _update = false;

/**
 * When checking for an update, inform the user.
 */
ipcRenderer.on('checkingForUpdate', (event, text) => {
    $('#update-ready p').text('Checking For Update...');
});

/**
 * When downloading the update, inform the user.
 */
ipcRenderer.on('download-progress', (event, text) => {
    $('#update-ready p').text('Downloading Update...');
});

/**
 * When no update is found, inform the user they are
 * up-to-date.
 */
ipcRenderer.on('update-not-available', (event, text) => {
    $('#update-ready p').text('Up To Date!');
});

/**
 * When the update is ready, inform the user and provide
 * the option to install the new update.
 */
ipcRenderer.on('updateReady', (event, text) => {
    $('#update-ready p').text('Update Is Available!');
    $('#version').css('color', 'red');
    $('#version').addClass('version-update');
    _update = true;
});

module.exports = {

    /**
     * Set update status.
     * @param {Boolean} bool 
     */
    setUpdate: function(bool) {
        _update = bool;
    },

    /**
     * Is application ready to update?
     * :BOOL:
     */
    isUpdateReady: function() {
        return _update;
    },
    
    /**
     * Quit application and install update.
     * :VOID:
     */
    update: function() {
        ipcRenderer.send('quitAndInstall');
        $('#update-ready p').text('Updating...');
        this.setUpdate(false);
    }
}