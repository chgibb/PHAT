import * as fs from "fs";
import * as readline from "readline";
import {EventEmitter} from "events";

export class Contig
{
    public bp : number;
    public name : string;
    public alias : string;
    public loaded : boolean;
    public uuid : string;
    public constructor()
    {
        const uuidv4 : () => string = require("uuid/v4");
        
        this.bp = 0;
        this.name = "";
        this.alias = "";
        this.loaded = false;
        this.uuid = uuidv4();
    }
}
export class FastaContigLoader extends EventEmitter
{
    public refStream : readline.ReadLine;
    public contigs : Array<Contig>;
    public contigIndex : number;
    public constructor()
    {
        super();
        this.refStream;
        this.contigs = new Array<Contig>();
        this.contigIndex = -1;
    }
    public beginRefStream(path : string) : void
    {
        let self = this;
        self.refStream = readline.createInterface(<readline.ReadLineOptions>{
            input : fs.createReadStream(path)
        });
        self.refStream.on("line",function(line : string)
        {
            if(line[0] == ">")
            {
                self.contigs.push(new Contig());
                ++self.contigIndex;
                self.contigs[self.contigIndex].name = line.substring(1);
                self.contigs[self.contigIndex].alias = self.contigs[self.contigIndex].name;
                if(self.contigIndex - 1 >= 0)
                {
                    self.contigs[self.contigIndex - 1].loaded = true;
                    self.emit("loadedContig",self.contigs[self.contigIndex - 1]);
                    console.log(self.contigs.length);
                }
            }
            else
            {
                for(let i = 0; i != line.length; ++i)
                {
                    if(line[i] == "\n")
                        break;
                    else
                        self.contigs[self.contigIndex].bp += 1;
                }
            }
        });
        self.refStream.on("close",function()
        {
            console.log("done loading contigs");
            self.contigs[self.contigIndex].loaded = true;
            self.emit("loadedContig",self.contigs[self.contigIndex]);
            self.emit("doneLoadingContigs");
        });
    }
}

//Promise wrapper for existing EventEmitter based implementation
export function getContigsFromFastaFile(path : string) : Promise<Array<Contig>>
{
    return new Promise<Array<Contig>>((resolve,reject) => 
    {
        const contigLoader = new FastaContigLoader();
        contigLoader.on(
            "doneLoadingContigs",function()
            {
                resolve(contigLoader.contigs);
            }
        );
        contigLoader.beginRefStream(path);
    });
}
