var QCReportSummary = require('./QCReportSummary.js');
module.exports = function(channel,arg,model)
{
	if(arg.retCode != 0)
		alert(JSON.stringify(arg,undefined,4));
    //QCReportCopy has completed a move
    if(arg.done)
	{
        //fastqc artifact -> fastq filename
		var name = arg.args[0].replace(new RegExp('(_fastqc)','g'),'.fastq');
		for(let i = 0; i != model.QCData.length; ++i)
		{
		    if(model.QCData[i].name == name)
			{
				model.QCData[i].QCReport = model.fsAccess("rt/QCReports/"+model.QCData[i].validID);
				//invoke report summmary to generate a report summary
				model.QCData[i].summary = QCReportSummary.getQCReportSummaries(model.fsAccess(arg.args[1]+"/fastqc_data.txt"));
				model.QCData[i].runningReport = false;
				//save changes
                model.postQCData();
				return;
			} 
		}
    }
}