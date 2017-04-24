const uuidv4 : () => string = require("uuid/v4");
import * as fastaContigLoader from "./../fastaContigLoader";
export class Contig extends fastaContigLoader.Contig
{
    public color? : string = "";
}
export class CircularFigure
{
    public uuid : string;
    public uuidFasta : string;
    public name : string;
    public contigs : Array<Contig>;
    public radius : number;
    public height : number;
    public width : number;
    constructor(name : string,uuid : string,contigs : Array<Contig>)
    {
        this.uuidFasta = uuid;
        this.uuid = uuidv4();
        this.name = name;
        this.contigs = contigs;
        this.radius = 120;
        this.height = 300;
        this.width = 300;
    }
}