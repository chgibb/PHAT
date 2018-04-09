/// <reference types="jquery" />
import * as electron from "electron";
const ipc = electron.ipcRenderer;

import * as viewMgr from "./../viewMgr";
import {ReportView} from "./reportView";
import {Fastq} from "./../../fastq";
import {getQCSummaryByNameOfReportByIndex} from "./../../QCData"
import {AtomicOperationIPC} from "./../../atomicOperationsIPC";
export class SummaryView extends viewMgr.View
{
	public fastqInputs : Array<Fastq>;
	public shouldAllowTriggeringOps : boolean;
	public constructor(div : string)
    {
    	super('summary',div);
		this.fastqInputs = new Array<Fastq>();
		this.shouldAllowTriggeringOps = true;
    }
	onMount(){}
	onUnMount(){}
	renderView()
	{
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
							if(!this.fastqInputs[i].QCData.reportRun)
							{
								if(this.shouldAllowTriggeringOps)
								{
									res += `<td class="cellHover" style='text-align:center;'><b id='${this.fastqInputs[i].uuid}'>Click to Analyze</b></td>`;
								}
								else
								{
									res += `<td><div class="three-quarters-loader"></div></td>`;
								}
							}
							else
							{
								res += `
									<td style='text-align:center;'>
										<p>
											<img class="cellHover" id='${this.fastqInputs[i].uuid}' src='img/done_Analysis.png' style='text-align:center;'>
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
			</table>
		`;
	}
	postRender(){}
	divClickEvents(event : JQueryEventObject) : void
	{
		if(!event || !event.target || !event.target.id)
        	return;
		for(let i : number = 0; i != this.fastqInputs.length; ++i)
		{
			if(this.fastqInputs[i].uuid == event.target.id)
			{
				if(!this.fastqInputs[i].QCData.reportRun)
				{
					ipc.send(
						"runOperation",<AtomicOperationIPC>{
							opName : "generateFastQCReport",
							channel : "input",
							key : "fastqInputs",
							uuid : this.fastqInputs[i].uuid
						}
					);
				}
				else
				{
                	(<ReportView>viewMgr.getViewByName("report")).fastqToReport = this.fastqInputs[i];
					viewMgr.changeView('report');
				}
			}
		}
	}
	dataChanged(){}
}
export function addView(arr : Array<viewMgr.View>,div : string) : void
{
	arr.push(new SummaryView(div));
}
