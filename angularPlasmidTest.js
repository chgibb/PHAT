let CircularGenomeWriter = require("./circularGenome/circularGenomeWriter");
let genomeWriter = new CircularGenomeWriter();
genomeWriter.on
(
    "loadedContig",function(contig)
    {
        console.log(contig.name);
    }
)
genomeWriter.on
(
    "doneLoadingContigs",function()
    {
        console.log(genomeWriter.contigs);
    }
)
genomeWriter.beginRefStream("/home/gibbsticks/refs/3HumanGenomic_Loci.fasta");