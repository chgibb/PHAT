var dFormat = require('./dateFormat');
module.exports.Data = class
{
    //Where fastq is an array of aliases and refIndex is a string
    constructor(fastqs,refIndex)
    {
        this.aligned = false;
        this.UUID = "";
        this.fastq = new Array();
        this.dateStampString = "";
        this.dateStamp = "";
        this.alias = "";
        this.invokeString = "";
        this.refIndex = "";
        this.type = "";
        this.summary = new Array();
        this.summaryText = "";
        if(!Array.isArray(fastqs))
            throw new Error("Type of first argument must be array");
        for(var i = 0; i < fastqs.length; ++i)
        {
            if(i >= 2)
                break;
            this.fastq.push(fastqs[i]);
            this.UUID += fastqs[i]+";";
        }
        this.refIndex = refIndex;
        this.UUID += refIndex+";";
        this.dateStamp = dFormat.generateFixedSizeDateStamp();
        this.UUID += this.dateStamp;
        this.dateStampString = dFormat.formatDateStamp(this.dateStamp);
    }
}