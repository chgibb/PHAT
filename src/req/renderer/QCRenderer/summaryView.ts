/// <reference types="jquery" />

import * as viewMgr from "./../viewMgr";
import {makeValidID,findOriginalInput} from "./../MakeValidID";
import QCClass from "./../QC";

import {ReportView} from "./reportView";
import Fastq from "./../fastq";
export class SummaryView extends viewMgr.View
{
	public fastqInputs : Array<Fastq>;
	public model : QCClass;
	public constructor(div : string,model : QCClass)
    {
    	super('summary',div,model);
        this.fastqInputs = new Array<Fastq>();
    }
	onMount(){}
	onUnMount(){}
	renderView()
	{
		let html = new Array<string>();
		html.push
		(
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
        let change = false;
	    for(let i = 0; i != this.fastqInputs.length; ++i)
	    {
			if(this.fastqInputs[i].checked)
		    {
            	html.push
                (
                    "<tr>"
                );
                if(this.model.QCData[i].QCReport == "")
				{
					html.push
			        (
				    	"<td style='text-align:center;'><b id='",this.fastqInputs[i].validID,"'>",'click to analyze',"</b></td>"
			        );
				}
				else
				{
					html.push
			        (
				    	"<td style='text-align:center;'><p>","<img id='",this.fastqInputs[i].validID,"' src='img/done_Analysis.png' style='text-align:center;'>","<br/>View Report</p></td>"
			        );
				}
			    html.push
			    (
					"<td>",this.fastqInputs[i].alias,"</td>"
			    );


			    for(let k = 0; k != this.model.QCData.length; ++k)
			    {
					if(this.model.QCData[k].name == this.fastqInputs[i].name)
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
	divClickEvents(event : JQueryEventObject) : void
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
                	(<ReportView>viewMgr.getViewByName("report")).report = this.model.QCData[i].QCReport;
					viewMgr.changeView('report');
				}
			}
		}
	}
	dataChanged(){}
}
export function addView(arr : Array<viewMgr.View>,div : string,model : QCClass) : void
{
	arr.push(new SummaryView(div,model));
}
