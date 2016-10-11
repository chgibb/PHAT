var QCData = require('./QCData');
var fs = require('fs');
var model = require('./model');
var canRead = require('./canRead');
var replyFromQCReportCopy = require('./QC/replyFromQCReportCopy');
var replyFromFastQC = require('./QC/replyFromFastQC');
module.exports = class extends model
{
    constructor(channel,handlers)
    {
        super(channel,handlers);
        this.QCData = new Array();

        this.fastQC = this.fsAccess('resources/app/FastQC/fastqc');
        this.QCReportCopy = this.fsAccess('resources/app/QCReportCopy');
    }
    postQCData()
    {
        this.postHandle(this.channel,{action : 'postState', key : 'QCData', val : this.QCData});
    }
    addQCData(name)
    {
        if(this.QCDataItemExists(name) || !canRead(name))
            return false;
        this.QCData.push(new QCData.Data(name));
        this.postQCData();
        return true;
    }
    QCDataItemExists(name)
    {
        for(var i in this.QCData)
        {
            if(this.QCData[i].name == name)
                return true;
        }
        return false;
    }
    generateQCReport(name)
    {
        if(!this.QCDataItemExists(name))
            return false;
        for(var i in this.QCData)
        {
            if(this.QCData[i].name == name)
            {
                if(this.QCData[i].runningReport)
                    return false;
                if(this.getQCSummaryByNameOfReportByIndex(i,"Per base sequence quality") != "No Data")
                    return false;
                this.QCData[i].runningReport = true;
                break;
            }
        }
        this.spawnHandle
	    (
		    'spawn',
		    {
			    action : 'spawn', 
			    replyChannel : this.channel, 
			    processName : this.fastQC,
			    args : [name],
			    unBuffer : true
		    }
	    );
        return true;
    }
    //returns 'pass', 'warn', 'fail', or 'No Data'
    getQCSummaryByNameOfReportByIndex(index,summary)
    {
	    var res = "";
	    var str = "";
	    for(var i in this.QCData[index].summary)
	    {
		    if(this.QCData[index].summary[i].name == summary)
		    {
			    return this.QCData[index].summary[i].status;
		    }
	    }
	    return "No Data";
    }
    spawnReply(channel,arg)
    {
        if(arg.processName == this.fastQC)
            replyFromFastQC(channel,arg,this);
        if(arg.processName == this.QCReportCopy)
            replyFromQCReportCopy(channel,arg,this);
    }
}