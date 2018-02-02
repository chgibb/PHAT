import Fastq from "./fastq";
import {getReadableAndWritable} from "./getAppPath";
export class QCData
{
    public summary : Array<QCSummary>;
    public validID : string;
    public reportRun : boolean;
    public constructor()
    {
        this.reportRun = false;
        this.summary = new Array<QCSummary>();
    }
}

export function getQCReportHTML(fastq : Fastq) : string
{
    return getReadableAndWritable(`rt/QCReports/${fastq.uuid}/fastqc_report.html`);
}

export function getQCReportData(fastq : Fastq) : string
{
    return getReadableAndWritable(`rt/QCReports/${fastq.uuid}/fastqc_data.txt`);
}

export class QCSummary
{
    public name : string;
    public status : string;
    public constructor(name : string,status : string)
    {
        if(name)
            this.name = name;
        else
            this.name = "";
        if(status)
            this.status = status;
        else
            this.status = "";
    }
}

//returns 'pass', 'warn', 'fail', or 'No Data'
export function getQCSummaryByNameOfReportByIndex(fastqInputs : Array<Fastq>,index : number,summary : string) : string
{
    try
    {
        for(let i = 0; i != fastqInputs[index].QCData.summary.length; ++i)
	    {
		    if(fastqInputs[index].QCData.summary[i].name == summary)
		    {
			    return fastqInputs[index].QCData.summary[i].status;
		    }
	    }
    }
    catch(err){}
	return "No Data";
}