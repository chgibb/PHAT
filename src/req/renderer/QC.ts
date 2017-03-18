/*let QCData = require('./QCData');
let fs = require('fs');
let model = require('./model');
let canRead = require('./canRead').default;
let replyFromQCReportCopy = require('./QC/replyFromQCReportCopy');
let replyFromFastQC = require('./QC/replyFromFastQC');*/
//module.exports = class extends model.DataModelMgr

import canRead from "./canRead";
import {QCData,QCSummary} from "./QCData";
import {DataModelHandlers,DataModelMgr} from "./model";
import {SpawnRequestParams} from "./../JobIPC";
import replyFromFastQC from "./QC/replyFromFastQC";
import replyFromQCReportCopy from "./QC/replyFromQCReportCopy";
export default class QCClass extends DataModelMgr
{
    public QCData : Array<QCData>;
    public fastQC : string;
    public QCReportCopy : string;
    public constructor(channel : string,handlers : DataModelHandlers)
    {
        super(channel,handlers);
        this.QCData = new Array();
        
        if(process.platform == "linux")
            this.fastQC = this.fsAccess('resources/app/FastQC/fastqc');
        else if(process.platform == "win32")
            this.fastQC = this.fsAccess('resources/app/perl/perl/bin/perl.exe');
        this.QCReportCopy = this.fsAccess('resources/app/QCReportCopy');
    }
    postQCData() : void
    {
        //this.postHandle(this.channel,{action : 'postState', key : 'QCData', val : this.QCData});
        this.postHandle(
            "saveKey",
            {
                action : "saveKey",
                channel : this.channel,
                key : "QCData",
                val : this.QCData
            }
        );
    }
    addQCData(name : string) : boolean
    {
        if(this.QCDataItemExists(name) || !canRead(name))
            return false;
        this.QCData.push(new QCData(name));
        return true;
    }
    QCDataItemExists(name : string) : boolean
    {
        for(let i = 0; i != this.QCData.length; ++i)
        {
            if(this.QCData[i].name == name)
                return true;
        }
        return false;
    }
    generateQCReport(name : string) : boolean
    {
        if(!this.QCDataItemExists(name))
            return false;
        for(let i = 0; i != this.QCData.length; ++i)
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
        let args;
        if(process.platform == "linux")
            args = [name];
        else if(process.platform == "win32")
            args = [this.fsAccess('resources/app/FastQC/fastqc'),name];
        this.spawnHandle
	    (
		    'spawn',
		    {
			    action : 'spawn', 
			    replyChannel : this.channel, 
			    processName : this.fastQC,
			    args : args,
			    unBuffer : true
		    }
	    );
        return true;
    }
    //returns 'pass', 'warn', 'fail', or 'No Data'
    getQCSummaryByNameOfReportByIndex(index : number,summary : string) : string
    {
	    let res = "";
	    let str = "";
        try
        {
            for(let i = 0; i != this.QCData[index].summary.length; ++i)
	        {
		        if(this.QCData[index].summary[i].name == summary)
		        {
			        return this.QCData[index].summary[i].status;
		        }
	        }
        }
        catch(err){}
	    return "No Data";
    }
    spawnReply(channel : string,arg : SpawnRequestParams) : void
    {
        if(arg.processName == this.fastQC)
            replyFromFastQC(channel,arg,this);
        if(arg.processName == this.QCReportCopy)
            replyFromQCReportCopy(channel,arg,this);
    }
}