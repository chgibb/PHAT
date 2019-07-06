import {Fastq} from "./../fastq";
import {importIntoProject} from "./../file";

let L6R1R2 : Fastq;

export function get() : Fastq
{
    return L6R1R2;
}

export function loadNoSpaces() : void
{
    console.log("loading L6R1R2 no spaces");
    L6R1R2 = new Fastq("data/L6R1.R2.fastq");
}

export function loadSpaces() : void
{
    console.log("loading L6R1R2 spaces");
    L6R1R2 = new Fastq("data with spaces/L6R1.R2.fastq");
}

export function importSampleIntoProject() : void
{
    importIntoProject(L6R1R2);
}