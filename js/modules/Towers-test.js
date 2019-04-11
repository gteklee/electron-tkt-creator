// list of towers
let _towers = [];

// All towers to put into zones
let _zones = {
    zone_1: [],
    zone_2: [],
    zone_3: [],
    zone_4: [],
    zone_5: [],
    zone_6: [],
    zone_7: [],
    zone_8: [],
};

/**
 * Get current list of towers.
 * :ARRAY:
 */
function getTowers() {
    return _towers;
}

/**
 * Set the list of towers
 * @param {Array} towers
 * :VOID:
 */
function setTowers(towers) {
    _towers = towers;
}

/**
 * Get current object of zones.
 * :OBJECT:
 */
function getZones() {
    return _zones;
}

/**
 * Remove specified towers from list.
 */
function cleanTowerList() {
    let i = 0;
    let towers = getTowers().slice();
    while(i < towers.length) {
        if(towers[i].id === 59 || towers[i].id === 60 || towers[i].id === 66) {
            towers.splice(i, 1);
            i--;
        }
        i++;
    }
    setTowers(towers);
    sortTowers();
}

/**
 * Sort towers A-Z.
 */
function sortTowers() {
    let towers = getTowers();
    towers.sort((a, b) => {
        let fName = a.name.toUpperCase();
        let lName = b.name.toUpperCase();

        if(fName < lName) { // Ascending
            return -1;
        }

        if(fName > lName) { // Descending
            return 1;
        }

        return 0; // No sorting
    });
}

/**
 * Associated each tower to a zone (1 - 8).
 */
function createZones() {
    let towers = getTowers();
    // Check each tower by id.
    for(let i = 0; i < towers.length; i++) {
        // Zone 1
        // 7, 8, 16, 25, 26 31, 33, 39, 40, 41, 42, 45, 48, 55, 59, 65, 68, 70, 75, 76, 78, 79, 84, 126, 131, 133
        if(towers[i].id == 7 || towers[i].id == 8 || towers[i].id == 16 || towers[i].id == 25 || towers[i].id == 26 || towers[i].id == 31 || towers[i].id == 33 || towers[i].id == 39 || towers[i].id == 40 || towers[i].id == 41 || towers[i].id == 42 || towers[i].id == 45 || towers[i].id == 48 || towers[i].id == 55 || towers[i].id == 59 || towers[i].id == 65 || towers[i].id == 68 || towers[i].id == 70 || towers[i].id == 75 || towers[i].id == 76 || towers[i].id == 78 || towers[i].id == 79 || towers[i].id == 84 || towers[i].id == 126 || towers[i].id == 131 || towers[i].id == 133) {
            _zones.zone_1.push(towers[i]);
        }
        else if(towers[i].id == 21 || towers[i].id == 34 || towers[i].id == 35 || towers[i].id == 51 || towers[i].id == 54 || towers[i].id == 56 || towers[i].id == 58 || towers[i].id == 72 || towers[i].id == 83 || towers[i].id == 88 || towers[i].id == 124 || towers[i].id == 135) { 
            // Zone 2
            // 21, 34, 35, 51, 54, 56, 58, 72, 83, 88, 124, 135
            _zones.zone_2.push(towers[i]);
        }
        else if(towers[i].id == 9 || towers[i].id == 24 || towers[i].id == 32 || towers[i].id == 52 || towers[i].id == 53 || towers[i].id == 64 || towers[i].id == 77 || towers[i].id == 81 || towers[i].id == 90 || towers[i].id == 93) { 
            // Zone 3
            // 9, 24, 32, 52, 53, 64, 72, 81, 90, 93
            _zones.zone_3.push(towers[i]);
        }
        else if(towers[i].id == 5 || towers[i].id == 6 || towers[i].id == 13 || towers[i].id == 15 || towers[i].id == 22 || towers[i].id == 27 || towers[i].id == 30 || towers[i].id == 36 || towers[i].id == 37 || towers[i].id == 44 || towers[i].id == 57 || towers[i].id == 71 || towers[i].id == 73 || towers[i].id == 85 || towers[i].id == 86 || towers[i].id == 87 || towers[i].id == 113 || towers[i].id == 127 || towers[i].id == 130 || towers[i].id == 134) { 
            // Zone 4
            // 5, 6, 13, 15, 22, 27, 30, 36, 37, 44, 57, 71, 73, 85, 86, 87, 113, 127, 130, 134
            _zones.zone_4.push(towers[i]);
        }
        else if(towers[i].id >= 1 && towers[i].id <= 4 || towers[i].id == 10 || towers[i].id == 11 || towers[i].id == 43 || towers[i].id == 49 || towers[i].id == 69 || towers[i].id == 125 || towers[i].id == 132) { 
            // Zone 5
            // 1, 2, 3, 4, 10, 11, 43, 49, 69, 125, 132
            _zones.zone_5.push(towers[i]);
        }
        else if(towers[i].id == 12 || towers[i].id == 19 || towers[i].id == 20 || towers[i].id == 23 || towers[i].id == 29 || towers[i].id == 38 || towers[i].id == 46 || towers[i].id == 128 || towers[i].id == 129) { 
            // Zone 6
            // 12, 19, 20, 23, 29, 38, 46, 128, 129
            _zones.zone_6.push(towers[i]);
        }
        else if(towers[i].id == 17 || towers[i].id == 18 || towers[i].id == 28 || towers[i].id == 47 || towers[i].id == 50 || towers[i].id == 80 || towers[i].id == 82 || towers[i].id == 91) { 
            // Zone 7
            // 17, 18, 28, 47, 50, 80, 82, 91
            _zones.zone_7.push(towers[i]);
        }
        else if(towers[i].id == 62 || towers[i].id == 63 || towers[i].id == 74 || towers[i].id == 89) { 
            // Zone 8
            // 62, 63, 74, 89
            _zones.zone_8.push(towers[i]);
        }
        else
            console.log('ERROR: Tower does not belong to a zone! ' + towers[i].name, towers[i].id);
    }
}

/**
 * Create options for dropdown selection.
 * :VOID:
 */
function createOptions() {
    let towers = getTowers();
    $('#input-job_tower').append($('<option>', {
        value: '',
        text: ''
    }));
    for(let i = 0; i < towers.length; i++) {

        $('#input-job_tower').append($('<option>', {
            value: towers[i].name,
            text: towers[i].name
        }));
    }
}

/**
 * Populate the towers array.
 * @param {Array} towers 
 */
function populateTowers(towers) {
    setTowers(towers);
    cleanTowerList();
    createZones();
    console.log(_zones);
    createOptions();
}



module.exports = {

    /**
     * Get all network sites from Sonar.
     * @param {Object} client 
     */
    retrieveTowers: function(client) {
        console.log(client.get);
        client.getAll.networkSites()
            .then(json => {
                if(json.error) {
                    console.log(json.error);
                } else {
                    populateTowers(json.data);
                }
            });
    },

    /**
     * Get all towers retreived from Sonar.
     */
    getTowers: function() {
        return getTowers();
    },

    /**
     * Get zone of a tower.
     * @param {String} tower 
     */
    getZone: function(tower) {
        let zones = getZones();
        if(zones.zone_1.filter(obj => obj.name == tower).length > 0) return 1;         // Zone 1
        else if(zones.zone_2.filter(obj => obj.name == tower).length > 0) return 2;    // Zone 2
        else if(zones.zone_3.filter(obj => obj.name == tower).length > 0) return 3;    // Zone 3
        else if(zones.zone_4.filter(obj => obj.name == tower).length > 0) return 4;    // Zone 4
        else if(zones.zone_5.filter(obj => obj.name == tower).length > 0) return 5;    // Zone 5
        else if(zones.zone_6.filter(obj => obj.name == tower).length > 0) return 6;    // Zone 6
        else if(zones.zone_7.filter(obj => obj.name == tower).length > 0) return 7;    // Zone 7
        else if(zones.zone_8.filter(obj => obj.name == tower).length > 0) return 8;    // Zone 8
        else
            console.log('Zone error!');
    }
};