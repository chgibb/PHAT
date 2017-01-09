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
//genomeWriter.beginRefStream("/home/gibbsticks/refs/3HumanGenomic_Loci.fasta");

let plasmidTrack = require("./circularGenome/plasmidTrack");
let plasmid = require("./circularGenome/plasmid");
let trackLabel = require("./circularGenome/trackLabel");
console.log
(
    plasmid.add
    (
        {
            sequenceLength : "360",
            plasmidHeight : "375",
            plasmidWidth  :"375"
        }
    )+
    plasmidTrack.add
    (
        {
            trackStyle : "fill:#f0f0f0;stroke:#ccc",
            radius : "120"
        }
    )+
    trackLabel.add
    (
        {
            text : "HSP70",
            labelStyle : "font-size:20px;font-weight:400"
        }
    )+
    trackLabel.end()+
    plasmidTrack.end()+
    plasmidTrack.add
    (
        {
            trackStyle : "fill:rgba(225,225,225,0.5)",
            radius : "120"
        }
    )+
    plasmidTrack.end()+

    plasmid.end()
);