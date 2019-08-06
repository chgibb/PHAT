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
    "Overrepresented sequences" |
    "Basic Stastics";

export class QCData
{
    public summary : Array<QCSummary>;
    public validID : string | undefined;
    public reportRun : boolean;
    public constructor()
    {
        this.reportRun = false;
        this.summary = new Array<QCSummary>();
    }
}

/**
 * Return path to the given fastq file's quality control report
 *
 * @export
 * @param {Fastq} fastq - Fastq file
 * @returns {string}
 */
export function getQCReportHTML(fastq : Fastq) : string
{
    return getReadableAndWritable(`rt/QCReports/${fastq.uuid}/fastqc_report.html`);
}

/**
 * Return path to the given fastq file's raw quality control data
 *
 * @export
 * @param {Fastq} fastq - Fastq file
 * @returns {string}
 */
export function getQCReportData(fastq : Fastq) : string
{
    return getReadableAndWritable(`rt/QCReports/${fastq.uuid}/fastqc_data.txt`);
}

export class QCSummary
{
    public name : QCReportType;
    public status : QCReportDisposition | undefined;
    public constructor(name : QCReportType,status : QCReportDisposition)
    {
        this.name = name;
        this.status = status;
    }
}

/**
 * Retrieve the given summary status of the quality control report in the given location in the given index
 *
 * @export
 * @param {Array<Fastq>} fastqInputs - Collection of fastq files
 * @param {number} index - Index to retrieve
 * @param {QCReportType} summary - Summary to retrieve
 * @returns {QCReportDisposition}
 */
export function getQCSummaryByNameOfReportByIndex(fastqInputs : Array<Fastq>,index : number,summary : QCReportType) : QCReportDisposition
{
    try
    {
        for(let i = 0; i != fastqInputs[index].QCData.summary.length; ++i)
        {
            if(fastqInputs[index].QCData.summary[i].name == summary)
            {
                return fastqInputs[index].QCData.summary[i].status!;
            }
        }
    }
    catch(err)
    {
        err;
    }
	
    return "No Data";
}

/**
 * Retrieve the given quality control report summary in the given fastq file
 *
 * @export
 * @param {Fastq} fastq - Fastq file
 * @param {QCReportType} summary - Quality control report summary
 * @returns {QCReportDisposition}
 */
export function getQCSummaryByName(fastq : Fastq,summary : QCReportType) : QCReportDisposition
{
    try
    {
        for(let i = 0; i != fastq.QCData.summary.length; ++i)
        {
            if(fastq.QCData.summary[i].name == summary)
            {
                return fastq.QCData.summary[i].status!;
            }
        }
    }
    catch(err)
    {
        err;
    }

    return "No Data";
}