let fs = require("fs");
let model = require("./model");
let canRead = require("./canRead");
let FastaContigLoader = require("./circularGenome/fastaContigLoader");
let fasta = require("./fasta");
class circularFigure
{
    constructor(contigs)
    {
        this.contigs = contigs;
        this.radius = 300;
    }
}
class ManagedFasta
{
    constructor(fasta)
    {
        this.alias = fasta.alias;
        this.name = fasta.name;
        this.loaded = false;
        this.contigLoader = new FastaContigLoader();
        this.circularFigures = new Array();
    }
}
module.exports = class extends model
{
    constructor(channel,handlers)
    {
        super(channel,handlers);
        this.managedFastas = new Array();
    }
    cacheFasta(fasta)
    {
        for(let i = 0; i != this.managedFastas.length; ++i)
        {
            if(this.managedFastas[i].name == name)
                return false;
        }
        this.managedFastas.push(new ManagedFasta(fasta.name,fasta.alias));
        let self = this;
        let idx = self.managedFastas.length - 1
        this.managedFastas[idx].on
        (
            "doneLoadContigs",function()
            {
                self.managedFastas[idx].loaded = true;
            }
        );
        this.managedFastas[idx].beginRefStream(fasta.name);
    }
    isCached(fasta)
    {
        for(let i = 0; i != this.managedFastas.length; ++i)
        {
            if(this.managedFastas[i].name == name)
            {
                if(this.managedFastas[i].loaded)
                    return true;
                return false;
            }
        }
        return false;
    }

    spawnReply(channel,arg){}
}