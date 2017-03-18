var id = require('./MakeValidID.js');
module.exports.Data = class
{
    constructor(name)
    {
        this.QCReport = "";
        this.checked = false;
        this.name = name;
        this.runningReport = false;
        this.summary = new Array();
        this.validID = id.makeValidID(name);
    }
}
module.exports.summary = class
{
    constructor(name,status)
    {
        if(name)
            this.name = name;
        else
            this.name = "";
        if(status)
            this.status = status;
        else
            this.status = "";
    }
}