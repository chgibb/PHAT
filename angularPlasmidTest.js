let fs = require("fs");
let refStream;
class Contig
{
    constructor()
    {
        this.bp = 0;
        this.contigName = 0;
    }
}
let contigs = new Array();
let contigIndex = -1;
function beginRefStream(path)
{
    refStream = fs.createReadStream(path,{encoding : "UTF8"});
    refStream.on
    (
        "data",function(data)
        {
            for(let i = 0; i != data.length; ++i)
            {
                if(data[i] == ">")
                {
                    contigs.push(new Contig());
                    ++contigIndex;
                    ++i;
                    while(data[i] != "\n")
                    {
                        contigs[contigIndex].contigName += data[i];
                        ++i;
                    }
                    continue;
                }
                else if(data[i] == "a" ||
                data[i] == "A" ||
                data[i] == "t" ||
                data[i] == "T" ||
                data[i] == "c" ||
                data[i] == "C" ||
                data[i] == "g" ||
                data[i] == "G")
                    contigs[contigIndex].bp += 1;
            }
        }
    )
    refStream.on
    (
        "end",function()
        {
            console.log(JSON.stringify(contigs,undefined,4));
        }
    )
}
beginRefStream("/home/gibbsticks/refs/3HumanGenomic_Loci.fasta");