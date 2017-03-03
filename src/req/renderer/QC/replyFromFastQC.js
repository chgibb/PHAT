let fse = require('fs-extra');

var id = require('./../MakeValidID.js');
var trimPath = require('./../trimPath.js');
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