import {Fasta} from "./../fasta";
import {importIntoProject} from "./../file";

let hpv18Ref : Fasta;

export function get() : Fasta
{
    return hpv18Ref;
}

export function loadNoSpaces() : void
{
    hpv18Ref = new Fasta("data/HPV18ref_genomes.fasta");
}

export function importRefIntoProject() : void
{
    importIntoProject(hpv18Ref);
}