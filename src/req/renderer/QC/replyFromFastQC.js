let fse = require('fs-extra');

var id = require('./../MakeValidID.js');
var trimPath = require('./../trimPath.js');
var QCReportSummary = require('./QCReportSummary.js');
module.exports = function(channel,arg,model)
{
    
    if(arg.done)
    {

        let idx = -1;
        if(process.platform == "linux")
            idx = 0;
        else if(process.platform == "win32")
            idx = 1;

        //trim the file name off of the full path
        let trimmed = trimPath(arg.args[idx]);
        //extract just the full path up to the  last slash
        let remainder = arg.args[idx].substr(0,arg.args[idx].length-trimmed.length);
        //convert from .fastq file ending to _fastqc directory name
        trimmed = trimmed.replace(new RegExp('(.fastq)','g'),'_fastqc');

        let srcDir = remainder + trimmed;
        let destDir = model.fsAccess('resources/app/rt/QCReports/'+id.makeValidID(arg.args[idx]));

        fse.copy
        (
            srcDir+"/fastqc_report.html",destDir+"/fastqc_report.html",{overwrite : true},function(err)
            {
                if(err)
                {
                    model.runningReport = false;
                    throw new Error("Could not move "+srcDir+"/fastqc_report.html");
                }
                fse.removeSync(srcDir+"/fastqc_report.html"); 
                fse.copy
                (
                    srcDir+"/summary.txt",destDir+"/summary.txt",{overwrite : true},function(err)
                    {
                        if(err)
                        {
                            model.runningReport = false;
                            throw new Error("Could not move "+srcDir+"/summary.txt");
                        }
                        fse.removeSync(srcDir+"/summary.txt");
                        fse.copy
                        (
                            srcDir+"/fastqc_data.txt",destDir+"/fastqc_data.txt",{overwrite : true},function(err)
                            {
                                if(err)
                                {
                                    model.runningReport = false;
                                    throw new Error("Could not move "+srcDir+"/fastqc_data.txt");
                                }
                                fse.removeSync(srcDir+"/fastqc_data.txt");
                                for(let i = 0; i != model.QCData.length; ++i)
                                {
                                    if(model.QCData[i].name == srcDir)
                                    {
                                        model.QCData[i].QCReport = model.fsAccess("rt/QCReports/"+model.QCData[i].validID);
                                        model.QCData[i].summary = QCReportSummary.getQCReportSummaries(destDir);
                                        model.QCData[i].runningReport = false;
                                        model.postQCData();
                                        return;
                                    }
                                }
                            }
                        );    
                    }
                );
            }
        );
        /*
        //trim the file name off of the full path
        var trimmed = trimPath(arg.args[0]);
        //extract just the full path up to the  last slash
        var remainder = arg.args[0].substr(0,arg.args[0].length-trimmed.length);
        //convert from .fastq file ending to _fastqc directory name
        trimmed = trimmed.replace(new RegExp('(.fastq)','g'),'_fastqc');
        model.spawnHandle
        (
            'spawn',
            {
                action : 'spawn',
                replyChannel : model.channel,
                processName : model.QCReportCopy,
                args : 
                [
                    remainder+trimmed,
                    model.fsAccess('resources/app/rt/QCReports/'+id.makeValidID(arg.args[0]))
                ],
                unBuffer : true
            }
        );*/
    }
}