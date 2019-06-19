import {Fastq} from "./fastq";
import {getReadableAndWritable} from "./getAppPath";

export type QCReportDisposition = 
    "pass" |
    "warn" |
    "fail" |
    "No Data";

export type QCReportType = 
    "Per base sequence quality" |
    "Per sequence quality scores" |
    "Per sequence GC content" |
    "Sequence Duplication Levels" |
    "Overrepresented sequences";

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
    public name : QCReportType;
    public status : QCReportDisposition;
    public constructor(name : QCReportType,status : QCReportDisposition)
    {
        this.name = name;
        this.status = status;
    }
}

export function getQCSummaryByNameOfReportByIndex(fastqInputs : Array<Fastq>,index : number,summary : QCReportType) : QCReportDisposition
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
    catch(err)
    {
        err;
    }
	
    return "No Data";
}

export function getQCSummaryByName(fastq : Fastq,summary : QCReportType) : QCReportDisposition
{
    try
    {
        for(let i = 0; i != fastq.QCData.summary.length; ++i)
        {
            if(fastq.QCData.summary[i].name == summary)
            {
                return fastq.QCData.summary[i].status;
            }
        }
    }
    catch(err)
    {
        err;
    }

    return "No Data";
}