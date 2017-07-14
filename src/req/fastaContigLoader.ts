import * as fs from "fs";
import {EventEmitter} from "events";
const uuidv4 : () => string = require("uuid/v4");
export class Contig
{
    public bp : number;
    public name : string;
    public alias : string;
    public loaded : boolean;
    public uuid : string;
    public constructor()
    {
        this.bp = 0;
        this.name = "";
        this.alias = "";
        this.loaded = false;
        this.uuid = uuidv4();
    }
}
export class FastaContigLoader extends EventEmitter
{
    public refStream : fs.ReadStream;
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
        this.refStream = fs.createReadStream(path,{encoding : "UTF8"});
        let self = this;
        this.refStream.on
        (
            "data",function(data : string)
            {
                for(let i = 0; i != data.length; ++i)
                {
                    if(data[i] == ">")
                    {
                        self.contigs.push(new Contig());
                        ++self.contigIndex;
                        ++i;
                        while(data[i] != "\n")
                        {
                            self.contigs[self.contigIndex].name += data[i];
                            self.contigs[self.contigIndex].alias += data[i];
                            ++i;
                        }
                        if(self.contigIndex - 1 >= 0)
                        {
                            self.contigs[self.contigIndex-1].loaded = true;
                            self.emit("loadedContig",self.contigs[self.contigIndex-1]);
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
                    data[i] == "G" ||
                    data[i] == "u" ||
                    data[i] == "U")
                        self.contigs[self.contigIndex].bp += 1;
                }
            }
        )
        this.refStream.on
        (
            "end",function()
            {
                self.contigs[self.contigIndex].loaded = true;
                self.emit("loadedContig",self.contigs[self.contigIndex]);
                self.emit("doneLoadingContigs");
                self.refStream = null;
            }
        )
    }
}
