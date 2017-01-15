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
            }
			onMount(){}
			onUnMount(){}
			renderView()
			{
				var html = new Array();
				html.push
				(
					"<img style='float:left;' src='img/done_Analysis.png'><p style='float:left;'>View Report</p>",
					"<p style='float:right;'>Failure</p><img style='float:right;' src='img/fail.png'>",
					"<p style='float:right;' >Warning</p><img style='float:right;' src='img/warn.png'>",
					"<p style='float:right;'>Pass</p><img style='float:right;' src='img/pass.png'>"
				);
	            html.push
	            (
		        	"<table style='width:100%'>",
		            "<tr>",
					"<th>Report</th>",
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
				        	"<tr>"   
			            );

						if(this.model.QCData[i].QCReport == "")
						{
							html.push
			        		(
				        	"<td style='text-align:center;'><b id='",this.data.fastqInputs[i].validID,"'>",'click to analyze',"</b></td>" 
			           		);
						}
						else
						{
							html.push
			        		(
				        	"<td style='text-align:center;'><p>","<img id='",this.data.fastqInputs[i].validID,"' src='img/done_Analysis.png' style='text-align:center;'>","</p></td>"   
			           		);
						}

						html.push
			        	(
				        	"<td>",this.data.fastqInputs[i].alias,"</td>" 
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
                            viewMgr.getViewByName("report").data.report = this.model.QCData[i].QCReport;
							viewMgr.changeView('report');
						}
					}
				}
			}
			dataChanged(){}
        }
    );
}