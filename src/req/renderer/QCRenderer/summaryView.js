var viewMgr = require('./../viewMgr');
var id = require('./../MakeValidID.js');
module.exports = function(arr,div,model)
{
	arr.push
    (
    	new class extends viewMgr.View
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
	            for(let i = 0; i != this.data.fastqInputs.length; ++i)
	            {
		    		if(this.data.fastqInputs[i].checked)
		            {
			        	html.push
			            (
				        	"<tr>",
				            "<td><p id='",this.data.fastqInputs[i].validID,"'>",this.data.fastqInputs[i].alias,"</p></td>"
			            );
			            for(let k = 0; k != this.model.QCData.length; ++k)
			            {
				        	if(this.model.QCData[k].name == this.data.fastqInputs[i].name)
				            {
					        	html.push
					            (
						        	"<td style='text-align:center;'>","<img src='img/",this.model.getQCSummaryByNameOfReportByIndex(k,"Per base sequence quality"),".png' style='text-align:center;'>","</td>",
						            "<td style='text-align:center;'>","<img src='img/",this.model.getQCSummaryByNameOfReportByIndex(k,"Per sequence quality scores"),".png' style='text-align:center;'>","</td>",
						            "<td style='text-align:center;'>","<img src='img/",this.model.getQCSummaryByNameOfReportByIndex(k,"Per sequence GC content"),".png' style='text-align:center;'>","</td>",
						            "<td style='text-align:center;'>","<img src='img/",this.model.getQCSummaryByNameOfReportByIndex(k,"Sequence Duplication Levels"),".png' style='text-align:center;'>","</td>",
						            "<td style='text-align:center;'>","<img src='img/",this.model.getQCSummaryByNameOfReportByIndex(k,"Overrepresented sequences"),".png' style='text-align:center;'>","</td>"
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

				for(let i = 0; i != this.model.QCData.length; ++i)
				{
					if(this.model.QCData[i].validID == event.target.id)
					{
						if(this.model.QCData[i].QCReport == "")
						{
							this.model.generateQCReport(this.model.QCData[i].name);
							return;
						}
						else
						{
							views[view.getIndexOfViewByName(views,'report')].data.report = this.model.QCData[i].QCReport;
							changeView('report');
						}
					}
				}
			}
			dataChanged(){}
        }
    );
}