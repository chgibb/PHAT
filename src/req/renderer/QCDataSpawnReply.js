//handle reply from fastqc report generation, invoke report copy and report summary to complete qcdata object
module.exports.QCDataSpawnReply = function(ipc,replyChannel,QCData,$)
{
    ipc.on
    (
        "spawnReply",
		function(event,arg)
		{
		    //from fastqc
			if(arg.processName == 'resources/app/FastQC/fastqc')
			{
				console.log("reply from fastqc "+arg.args[0]);
			    //update to job status
				if(!arg.done)
				    $('#'+id.makeValidID(arg.args[0])+'_p').text(arg.data);
				//fastqc has completed generating a report
				if(arg.done)
				{
					console.log("fastqc complete "+arg.args[0]);
				    //set the item name back to its name
					$('#'+id.makeValidID(arg.args[0])+'_p').text(arg.args[0]);
					//invoke report copy to move the report into the application
					ipc.send
					(
					    'spawn',
						{
						    action : 'spawn',
							replyChannel : replyChannel,
							processName : 'resources/app/reportCopy',
							args :
							[
							    //fastq filename -> fastqc artifact 
								arg.args[0].replace(new RegExp('(.fastq)','g'),'_fastqc'),
								"resources/app/rt/QCReports/"+id.makeValidID(arg.args[0])
                            ]
						}
					);
					console.log("invoked reportCopy for "+arg.args[0]);
				}
			}
			if(arg.processName == 'resources/app/reportCopy')
			{
				//console.log("reply from reportCopy "+arg.args[0]);
                //reportCopy has completed a move
			    if(arg.done)
				{
					console.log("reportCopy complete "+arg.args[0]);
					//fastqc artifact -> fastq filename
					var name = arg.args[0].replace(new RegExp('(_fastqc)','g'),'.fastq');
				    for(var i in QCData)
					{
					    console.log("\""+QCData[i].name+"\" \""+name+"\"");
						if(QCData[i].name == name)
						{
							console.log("\""+QCData[i].name+"\"   \""+name+"\"");
						    QCData[i].QCReport = "rt/QCReports/"+id.makeValidID(QCData[i].name);
							//invoke report summmary to generate a report summary
							QCData[i].summary = require('./QCReportSummary.js').getQCReportSummaries("resources/app/"+QCData[i].QCReport+"/fastqc_data.txt");
							//save changes
							ipc.send('QC',{action : 'postState', key : 'QCData', val : QCData});
							return;
						} 
					}
					console.log("Could not find "+name);
					console.log(JSON.stringify(QCData,undefined,4));
				//	var err = "Could not save generated report for "+QCData[i].name+" "+name;
				//	alert(QCData[i].name + "  " + name);
					//throw err;
				}
			}
		}
	);
}