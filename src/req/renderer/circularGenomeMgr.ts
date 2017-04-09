let fs = require("fs");
import {DataModelMgr,DataModelHandlers} from "./model";
import {SpawnRequestParams} from "./../JobIPC";
let canRead = require("./canRead");
import {Contig,FastaContigLoader} from "./circularGenome/fastaContigLoader";
import {SaveKeyEvent} from "../ipcEvents";
import {Fasta} from "./fasta";
export class CircularFigure
{
    public name : string;
    public contigs : any;
    public radius : number;
    constructor(name : string,contigs : any)
    {
        this.name = name;
        this.contigs = contigs;
        this.radius = 300;
    }
}
class ManagedFasta
{
    public alias : string;
    public name : string;
    public validID : string;
    public loaded : boolean;
    public contigs : any;
    public circularFigures : Array<CircularFigure>;
    constructor(fasta : Fasta)
    {
        this.alias = fasta.alias;
        this.name = fasta.name;
        this.validID = fasta.validID;
        this.loaded = false;
        this.contigs = {};
        this.circularFigures = new Array<CircularFigure>();
    }
}
class RunningLoader
{
    public fasta : Fasta;
    public loader : FastaContigLoader;

    constructor(fasta : Fasta,onComplete : () => void)
    {
        this.fasta = fasta;
        this.loader = new FastaContigLoader();
        this.loader.on("doneLoadingContigs",onComplete);
        this.loader.beginRefStream(fasta.name);
    }
}
export class CircularGenomeMgr extends DataModelMgr
{
    public managedFastas : Array<ManagedFasta>;
    public runningLoaders : Array<RunningLoader>;
    public constructor(channel : string,handlers : DataModelHandlers)
    {
        super(channel,handlers);
        this.managedFastas = new Array<ManagedFasta>();
        this.runningLoaders = new Array<RunningLoader>();
    }
    public cacheFasta(fasta : Fasta) : boolean
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
        return true;
    }
    public isCached(fasta : Fasta) : boolean
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
    public postManagedFastas() : void
    {
        //this.postHandle(this.channel,{action : "postState", key : "managedFastas",val : this.managedFastas});
        this.postHandle(
            "saveKey",
            <SaveKeyEvent>{
                action : "saveKey",
                channel : this.channel,
                key : "managedFastas",
                val : this.managedFastas
            }
        );
    }
    spawnReply(channel : string,arg : SpawnRequestParams) : void{}
}