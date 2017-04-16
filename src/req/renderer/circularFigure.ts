import {Contig} from "./../fastaContigLoader";
export class CircularFigure
{
    public uuid : string;
    public name : string;
    public contigs : Array<Contig>;
    public radius : number;
    public height : number;
    public width : number;
    constructor(name : string,contigs : Array<Contig>)
    {
        this.name = name;
        this.contigs = contigs;
        this.radius = 120;
        this.height = 300;
        this.width = 300;
    }
}