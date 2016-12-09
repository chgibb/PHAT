var view = require('./../view.js');
var id = require('./../MakeValidID.js');
module.exports = function(arr,div)
{
	arr.push
    (
    	new class extends view.View
        {
        	constructor()
            {
            	super('summary',div,model);
                this.data.fastqInputs = new Array();
                this.data.QCData = new Array();
            }
			onMount(){}
			onUnMount(){}
			renderView()
			{
				var html = new Array();
				html.push
				(
					"<img style='float:left;' src='img/pass.png'><p style='float:left;'>Pass</p>",
					"<img style='float:left;' src='img/warn.png'><p style='float:left;' >Warning</p>",
					"<img style='float:left;' src='img/fail.png'><p style='float:left;'>Failure</p>"
				);
	            html.push
	            (
		        	"<table style='width:100%'>",
		            "<tr>",
		            "<th>Sample</th>",
		            "<th>Per Base Sequence Quality</th>",
		            "<th>Per Sequence Quality Scores</th>",
		            "<th>Per Sequence GC Content</th>",
		            "<th>Sequence Duplication Levels</th>",
		            "<th>Over Represented Sequences</th>",
		            "</tr>"
	            );
                var change = false;
	            for(var i in parentView.data.fastqInputs)
	            {
		    		if(parentView.data.fastqInputs[i].checked)
		            {
			        	html.push
			            (
				        	"<tr>",
				            "<td><p id='",parentView.data.fastqInputs[i].validID,"'>",parentView.data.fastqInputs[i].alias,"</p></td>"
			            );
			            for(var k in parentView.data.QCData)
			            {
				        	if(parentView.data.QCData[k].name == parentView.data.fastqInputs[i].name)
				            {
					        	html.push
					            (
						        	"<td style='text-align:center;'>","<img src='../img/",QC.getQCSummaryByNameOfReportByIndex(k,"Per base sequence quality"),".png' style='text-align:center;'>","</td>",
						            "<td style='text-align:center;'>","<img src='../img/",QC.getQCSummaryByNameOfReportByIndex(k,"Per sequence quality scores"),".png' style='text-align:center;'>","</td>",
						            "<td style='text-align:center;'>","<img src='../img/",QC.getQCSummaryByNameOfReportByIndex(k,"Per sequence GC content"),".png' style='text-align:center;'>","</td>",
						            "<td style='text-align:center;'>","<img src='../img/",QC.getQCSummaryByNameOfReportByIndex(k,"Sequence Duplication Levels"),".png' style='text-align:center;'>","</td>",
						            "<td style='text-align:center;'>","<img src='../img/",QC.getQCSummaryByNameOfReportByIndex(k,"Overrepresented sequences"),".png' style='text-align:center;'>","</td>"
					            );
				            }
			            }
			            html.push
			            (
				        	"</tr>"
			            );
		            }
	            }
	            html.push
	            (
		        	"</table>"
	            );
                return html.join('');
			}
			postRender(){}
			divClickEvents(event)
			{
				if(!event || !event.target || !event.target.id)
                	return;

				for(var i in parentView.data.QCData)
				{
					if(parentView.data.QCData[i].validID == event.target.id)
					{
						if(parentView.data.QCData[i].QCReport == "")
						{
							QC.generateQCReport(parentView.data.QCData[i].name);
							return;
						}
						else
						{
							views[view.getIndexOfViewByName(views,'report')].data.report = parentView.data.QCData[i].QCReport;
							changeView('report');
						}
					}
				}
			}
			dataChanged(){}
        }
    );
}