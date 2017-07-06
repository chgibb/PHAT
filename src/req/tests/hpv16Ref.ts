import {Fasta} from "./../fasta";
import {importIntoProject} from "./../file";

let hpv16Ref : Fasta;

export function get() : Fasta
{
    return hpv16Ref;
}

export function loadNoSpaces() : void
{
    hpv16Ref = new Fasta("data/HPV16ref_genomes.fasta");
}

export function importRefIntoProject() : void
{
    importIntoProject(hpv16Ref);
}