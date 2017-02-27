let fs = require("fs");
let model = require("./model");
let canRead = require("./canRead");
let FastaContigLoader = require("./circularGenome/fastaContigLoader");
let fasta = require("./fasta");
module.exports.circularFigure = class
{
    constructor(name,contigs)
    {
        this.name = name;
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
        this.validID = fasta.validID;
        this.loaded = false;
        this.contigs = {};
        this.circularFigures = new Array();
    }
}
class RunningLoader
{
    constructor(fasta,onComplete)
    {
        this.fasta = fasta;
        this.loader = new FastaContigLoader();
        this.loader.on("doneLoadingContigs",onComplete);
        this.loader.beginRefStream(fasta.name);
    }
}
module.exports.Mgr = class extends model
{
    constructor(channel,handlers)
    {
        super(channel,handlers);
        this.managedFastas = new Array();
        this.runningLoaders = new Array();
    }
    cacheFasta(fasta)
    {
        for(let i = 0; i != this.managedFastas.length; ++i)
        {
            if(this.managedFastas[i].name == fasta.name)
                return false;
        }
        this.managedFastas.push(new ManagedFasta(fasta));
        let self = this;
        this.runningLoaders.push
        (
            new RunningLoader(fasta,function()
            {
                for(let i = 0; i != self.managedFastas.length; ++i)
                {
                    if(self.managedFastas[i].name == fasta.name)
                    {
                        self.managedFastas[i].loaded = true;
                        self.managedFastas[i].contigs = this.contigs;
                        self.postManagedFastas();
                        return;
                    }
                }
            })
        );
    }
    isCached(fasta)
    {
        for(let i = 0; i != this.managedFastas.length; ++i)
        {
            if(this.managedFastas[i].name == fasta.name)
            {
                if(this.managedFastas[i].loaded)
                    return true;
                return false;
            }
        }
        return false;
    }
    postManagedFastas()
    {
        this.postHandle(this.channel,{action : "postState", key : "managedFastas",val : this.managedFastas});
    }
    spawnReply(channel,arg){}
}