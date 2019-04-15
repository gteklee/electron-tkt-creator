let Towers = new function()
{
    // All towers listed in Sonar.
    this.towers = [];

    // All towers put into the appropriate zones.
    this.Zones = {
        zone_1: [],
        zone_2: [],
        zone_3: [],
        zone_4: [],
        zone_5: [],
        zone_6: [],
        zone_7: [],
        zone_8: []
    };

    /**
     * Get all network sites from Sonar.
     */
    this.RetrieveTowers = function()
    {
        this.Sonar = require('../../server/Sonar.js');

        this.Sonar.Towers.GetTowers(sessionStorage.username, sessionStorage.password, (obj) => {
            console.log(obj);
            if(obj.error) // Make sure no error
                console.log(obj.error);
            else
                this.PopulateTowers(obj); // Populate towers array.
        });
    }

    /**
     * Populate towers array.
     * @param {*} obj 
     */
    this.PopulateTowers = function(obj)
    {
        this.towers = obj.data;

        this.cleanTowerList();

        this.createOptions();
    }

    /**
     * Create options for selection.
     */
    this.createOptions = function()
    {
        $('#input-job_tower').append($('<option>', {
            value: '',
            text: ''
        }));
        for(let i = 0; i < this.towers.length; i++)
        {

            $('#input-job_tower').append($('<option>', {
                value: this.towers[i].name,
                text: this.towers[i].name
            }));
        }
    }

    /**
     * Get the zone based on the name of the selected tower.
     */
    this.getZone = function(tower)
    {
        if(this.Zones.zone_1.filter(obj => obj.name == tower).length > 0) return 1;         // Zone 1
        else if(this.Zones.zone_2.filter(obj => obj.name == tower).length > 0) return 2;    // Zone 2
        else if(this.Zones.zone_3.filter(obj => obj.name == tower).length > 0) return 3;    // Zone 3
        else if(this.Zones.zone_4.filter(obj => obj.name == tower).length > 0) return 4;    // Zone 4
        else if(this.Zones.zone_5.filter(obj => obj.name == tower).length > 0) return 5;    // Zone 5
        else if(this.Zones.zone_6.filter(obj => obj.name == tower).length > 0) return 6;    // Zone 6
        else if(this.Zones.zone_7.filter(obj => obj.name == tower).length > 0) return 7;    // Zone 7
        else if(this.Zones.zone_8.filter(obj => obj.name == tower).length > 0) return 8;    // Zone 8
        else
            console.log('Zone error: ' + tower);
    }

    /**
     * Clean the towers array.
     */
    this.cleanTowerList = function()
    {
        let i = 0;
        while(i < this.towers.length)
        {
            if(this.towers[i].id == 59 || this.towers[i].id == 60 || this.towers[i].id == 66)
            {
                this.towers.splice(i, 1);
                i--;
            }
            i++;
        }
        this.alphaTowerList();
    }

    /**
     * Alphabetize the passed in array.
     */
    this.alphaTowerList = function()
    {
        this.towers.sort((a, b) => {
            let fName = a.name.toUpperCase(),
                lName = b.name.toUpperCase();

            if(fName < lName) // Ascending sort.
                return -1;
            
            if(fName > lName)
                return 1;

            return 0;   // No sorting.
        });

        this.createZones();
        console.log(this.Zones);
    }

    /**
     * Create zones based on new tower list.
     */
    this.createZones = function()
    {
        // Check each tower by id.
        for(let i = 0; i < this.towers.length; i++)
        {   
            // Zone 1
            // 7, 8, 16, 25, 26 31, 33, 39, 40, 41, 42, 45, 48, 55, 59, 65, 68, 70, 75, 76, 78, 79, 84, 126, 131, 133
            if(this.towers[i].id == 7 || this.towers[i].id == 8 || this.towers[i].id == 16 || this.towers[i].id == 25 || this.towers[i].id == 26 || this.towers[i].id == 31 || this.towers[i].id == 33 || this.towers[i].id == 39 || this.towers[i].id == 40 || this.towers[i].id == 41 || this.towers[i].id == 42 || this.towers[i].id == 45 || this.towers[i].id == 48 || this.towers[i].id == 55 || this.towers[i].id == 59 || this.towers[i].id == 65 || this.towers[i].id == 68 || this.towers[i].id == 70 || this.towers[i].id == 75 || this.towers[i].id == 76 || this.towers[i].id == 78 || this.towers[i].id == 79 || this.towers[i].id == 84 || this.towers[i].id == 126 || this.towers[i].id == 131 || this.towers[i].id == 133)
            {
                this.Zones.zone_1.push(this.towers[i]);
            }
            else if(this.towers[i].id == 21 || this.towers[i].id == 34 || this.towers[i].id == 35 || this.towers[i].id == 51 || this.towers[i].id == 54 || this.towers[i].id == 56 || this.towers[i].id == 58 || this.towers[i].id == 72 || this.towers[i].id == 83 || this.towers[i].id == 88 || this.towers[i].id == 124 || this.towers[i].id == 135)
            { // Zone 2
              // 21, 34, 35, 51, 54, 56, 58, 72, 83, 88, 124, 135
                this.Zones.zone_2.push(this.towers[i]);
            }
            else if(this.towers[i].id == 9 || this.towers[i].id == 24 || this.towers[i].id == 32 || this.towers[i].id == 52 || this.towers[i].id == 53 || this.towers[i].id == 64 || this.towers[i].id == 77 || this.towers[i].id == 81 || this.towers[i].id == 90 || this.towers[i].id == 93)
            { // Zone 3
              // 9, 24, 32, 52, 53, 64, 72, 81, 90, 93
                this.Zones.zone_3.push(this.towers[i]);
            }
            else if(this.towers[i].id == 5 || this.towers[i].id == 6 || this.towers[i].id == 13 || this.towers[i].id == 15 || this.towers[i].id == 22 || this.towers[i].id == 27 || this.towers[i].id == 30 || this.towers[i].id == 36 || this.towers[i].id == 37 || this.towers[i].id == 44 || this.towers[i].id == 57 || this.towers[i].id == 71 || this.towers[i].id == 73 || this.towers[i].id == 85 || this.towers[i].id == 86 || this.towers[i].id == 87 || this.towers[i].id == 113 || this.towers[i].id == 127 || this.towers[i].id == 130 || this.towers[i].id == 134)
            { // Zone 4
              // 5, 6, 13, 15, 22, 27, 30, 36, 37, 44, 57, 71, 73, 85, 86, 87, 113, 127, 130, 134
                this.Zones.zone_4.push(this.towers[i]);
            }
            else if(this.towers[i].id >= 1 && this.towers[i].id <= 4 || this.towers[i].id == 10 || this.towers[i].id == 11 || this.towers[i].id == 43 || this.towers[i].id == 49 || this.towers[i].id == 69 || this.towers[i].id == 125 || this.towers[i].id == 132)
            { // Zone 5
              // 1, 2, 3, 4, 10, 11, 43, 49, 69, 125, 132
                this.Zones.zone_5.push(this.towers[i]);
            }
            else if(this.towers[i].id == 12 || this.towers[i].id == 19 || this.towers[i].id == 20 || this.towers[i].id == 23 || this.towers[i].id == 29 || this.towers[i].id == 38 || this.towers[i].id == 46 || this.towers[i].id == 128 || this.towers[i].id == 129)
            { // Zone 6
              // 12, 19, 20, 23, 29, 38, 46, 128, 129
                this.Zones.zone_6.push(this.towers[i]);
            }
            else if(this.towers[i].id == 17 || this.towers[i].id == 18 || this.towers[i].id == 28 || this.towers[i].id == 47 || this.towers[i].id == 50 || this.towers[i].id == 80 || this.towers[i].id == 82 || this.towers[i].id == 91)
            { // Zone 7
              // 17, 18, 28, 47, 50, 80, 82, 91
                this.Zones.zone_7.push(this.towers[i]);
            }
            else if(this.towers[i].id == 62 || this.towers[i].id == 63 || this.towers[i].id == 74 || this.towers[i].id == 89)
            { // Zone 8
              // 62, 63, 74, 89
                this.Zones.zone_8.push(this.towers[i]);
            }
            else
                console.log('ERROR: Tower does not belong to a zone! ' + this.towers[i].name, this.towers[i].id);
        }
    }
}

module.exports = Towers;