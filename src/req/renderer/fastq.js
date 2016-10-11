var id = require('./MakeValidID.js');
var trimPath = require('./trimPath.js');
module.exports = class
{
    constructor(name)
    {
        this.name = name;
        this.alias = trimPath(name);
        this.size = 0;
        this.sizeString = "0";
        this.sequences = 0;
        this.validID = id.makeValidID(name);
        this.checked = false;
    }
}