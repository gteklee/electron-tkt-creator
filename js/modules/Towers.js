let Towers = new function()
{
    this.towers = [];

    /**
     * Get all network sites from Sonar.
     */
    this.RetrieveTowers = function()
    {
        this.Sonar = require('../../server/Sonar.js');

        this.Sonar.Towers.GetTowers(sessionStorage.username, sessionStorage.password, (obj) => {

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
        $('#input-repair-tkt_tower').append($('<option>', {
            value: '',
            text: ''
        }));
        for(let i = 0; i < this.towers.length; i++)
        {

            $('#input-repair-tkt_tower').append($('<option>', {
                value: this.towers[i].id,
                text: this.towers[i].name
            }));
        }
    }

    /**
     * Clean the towers array.
     */
    this.cleanTowerList = function()
    {
        let i = 0;
        while(i < this.towers.length)
        {
            if(this.towers[i].id == 60 || this.towers[i].id == 61 || this.towers[i].id == 66 || this.towers[i].id == 71 || this.towers[i].id == 76 || this.towers[i].id == 75 || this.towers[i].id > 84 && this.towers[i].id < 89)
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
    }
}

module.exports = Towers;