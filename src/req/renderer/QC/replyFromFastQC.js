var id = require('./../MakeValidID.js');
var trimPath = require('./../trimPath.js').default;
module.exports = function(channel,arg,model)
{
    
    //if(arg.unBufferedData && new RegExp("99","g").test(arg.unBufferedData))
    if(arg.done && arg.retCode !== undefined)
    {
        if(arg.retCode != 0)
            alert("returned "+arg.retCode);
        let idx = -1;
        if(process.platform == "linux")
            idx = 0;
        else if(process.platform == "win32")
            idx = 1;
        //trim the file name off of the full path
        var trimmed = trimPath(arg.args[idx]);
        //extract just the full path up to the  last slash
        var remainder = arg.args[idx].substr(0,arg.args[idx].length-trimmed.length);
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
                    model.fsAccess('resources/app/rt/QCReports/'+id.makeValidID(arg.args[idx]))
                ],
                unBuffer : true
            }
        );
    }
}