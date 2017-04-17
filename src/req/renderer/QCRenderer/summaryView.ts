/// <reference types="jquery" />

import * as viewMgr from "./../viewMgr";
import QCClass from "./../QC";
import {ReportView} from "./reportView";
import Fastq from "./../../fastq";
import {getQCSummaryByNameOfReportByIndex} from "./../../QCData"
export class SummaryView extends viewMgr.View
{
	public fastqInputs : Array<Fastq>;
	public constructor(div : string)
    {
    	super('summary',div);
        this.fastqInputs = new Array<Fastq>();
    }
	onMount(){}
	onUnMount(){}
	renderView()
	{
		
		/*
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
		*/
		return `
			<p style='float:right;'>Failure</p><img style='float:right;' src='img/fail.png'>
			<p style='float:right;' >Warning</p><img style='float:right;' src='img/warn.png'>
			<p style='float:right;'>Pass</p><img style='float:right;' src='img/pass.png'>

			<table style='width:100%'>
				<tr>
					<th>Report</th>
					<th>Sample</th>
					<th>Per Base Sequence Quality</th>
					<th>Per Sequence Quality Scores</th>
					<th>Per Sequence GC Content</th>
					<th>Sequence Duplication Levels</th>
					<th>Over Represented Sequences</th>
				</tr>
				${(()=>{
					let res = "";
					for(let i : number = 0; i != this.fastqInputs.length; ++i)
					{
						if(this.fastqInputs[i].checked)
						{
							res += `<tr>`;
							if(this.fastqInputs[i].QCData.QCReport == "")
							{
								res += `<td style='text-align:center;'><b id='${this.fastqInputs[i].uuid}'>click to analyze</b></td>`;
							}
							else
							{
								res += `
									<td style='text-align:center;'>
										<p>
											<img id='${this.fastqInputs[i].uuid}' src='img/done_Analysis.png' style='text-align:center;'>
											<br/>
											View Report
											</p>
									</td>`;
							}
							res += `
								<td>${this.fastqInputs[i].alias}</td>
								<td style='text-align:center;'>
									<img src='img/${getQCSummaryByNameOfReportByIndex(this.fastqInputs,i,"Per base sequence quality")}.png' style='text-align:center;'>
								</td>
								<td style='text-align:center;'>
									<img src='img/${getQCSummaryByNameOfReportByIndex(this.fastqInputs,i,"Per sequence quality scores")}.png' style='text-align:center;'>
								</td>
								<td style='text-align:center;'>	
									<img src='img/${getQCSummaryByNameOfReportByIndex(this.fastqInputs,i,"Per sequence GC content")}.png' style='text-align:center;'>
								</td>
								<td style='text-align:center;'>	
									<img src='img/${getQCSummaryByNameOfReportByIndex(this.fastqInputs,i,"Sequence Duplication Levels")}.png' style='text-align:center;'>
								</td>
								<td style='text-align:center;'>	
									<img src='img/${getQCSummaryByNameOfReportByIndex(this.fastqInputs,i,"Overrepresented sequences")}.png' style='text-align:center;'>
								</td>
								</tr>
							`;
						}
					}
					return res;
				})()}
		`;
	}
	postRender(){}
	divClickEvents(event : JQueryEventObject) : void
	{/*
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
		}*/
	}
	dataChanged(){}
}
export function addView(arr : Array<viewMgr.View>,div : string) : void
{
	arr.push(new SummaryView(div));
}
