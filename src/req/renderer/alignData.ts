let dFormat = require('./dateFormat');
import Fastq from "./fastq";
import Fasta from "./fasta";
import {Bowtie2Report} from "./bowTie2AlignmentReportParser";
export default class alignData
{
    public aligned : boolean;
    public UUID : string;
    public fastq : Array<Fastq>;
    public dateStampString : string;
    public dateStamp : string;
    public alias : string;
    public invokeString : string;
    public refIndex : Fasta;
    public type : string;
    public summary : Bowtie2Report;
    public summaryText : string;
    public constructor(fastqs : Array<Fastq>,refIndex : Fasta)
    {
        this.aligned = false;
        this.UUID = "";
        this.fastq = new Array();
        this.dateStampString = "";
        this.dateStamp = "";
        this.alias = "";
        this.invokeString = "";
        this.type = "";
        this.summaryText = "";
        for(let i = 0; i < fastqs.length; ++i)
        {
            if(i >= 2)
                break;
            this.fastq.push(fastqs[i]);
            this.UUID += fastqs[i].alias+";";
        }
        this.refIndex = refIndex;
        this.UUID += refIndex+";";
        this.dateStamp = dFormat.generateFixedSizeDateStamp();
        this.UUID += this.dateStamp;
        this.dateStampString = dFormat.formatDateStamp(this.dateStamp);
    }
}