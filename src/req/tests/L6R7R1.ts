import {Fastq} from "./../fastq";
import {importIntoProject} from "./../file";

let L6R7R1 : Fastq;

export function get() : Fastq
{
    return L6R7R1;
}

export function loadNoSpaces() : void
{
    console.log("loading L6R7R1 no spaces");
    L6R7R1 = new Fastq('data/L6R7.R1.fastq');
}

export function loadSpaces() : void
{
    console.log("loading L6R7R1 spaces");
    L6R7R1 = new Fastq('data with spaces/L6R7.R1.fastq');
}

export function importSampleIntoProject() : void
{
    importIntoProject(L6R7R1);
}