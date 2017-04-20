const uuidv1 : () => string = require("uuid/v1");
import {Contig} from "./../fastaContigLoader";
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
        this.uuid = uuidv1();
        this.name = name;
        this.contigs = contigs;
        this.radius = 120;
        this.height = 300;
        this.width = 300;
    }
}