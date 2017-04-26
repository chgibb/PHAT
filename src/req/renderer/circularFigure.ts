import * as fs from "fs";
const uuidv4 : () => string = require("uuid/v4");
import * as fastaContigLoader from "./../fastaContigLoader";
import * as plasmidTrack from "./circularGenome/plasmidTrack";
import * as trackLabel from "./circularGenome/trackLabel";
import * as trackMarker from "./circularGenome/trackMarker";
import * as markerLabel from "./circularGenome/markerLabel";
import * as trackScale from "./circularGenome/trackScale";
export class Contig extends fastaContigLoader.Contig
{
    public color? : string = "";
}
//adapted from answer by letronje and edited by Peter Mortensen
//http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
function getRandColor(brightness : number)
{
    // Six levels of brightness from 0 to 5, 0 being the darkest
    let rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
    let mix = [brightness*51, brightness*51, brightness*51]; //51 => 255/5
    let mixedrgb = [rgb[0] + mix[0], rgb[1] + mix[1], rgb[2] + mix[2]].map(function(x){return Math.round(x/2.0)});
    return "rgb(" + mixedrgb.join(",") + ")";
}
export class CircularFigureBPTrackOptions
{
    public interval : number;
    public vAdjust : number;
    public showLabels : number;
    constructor()
    {
        this.interval = 500;
        this.vAdjust = 5;
        this.showLabels = 0;
    }
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
    public circularFigureBPTrackOptions : CircularFigureBPTrackOptions;
    constructor(name : string,uuid : string,contigs : Array<Contig>)
    {
        this.uuidFasta = uuid;
        this.uuid = uuidv4();
        this.name = name;
        this.contigs = contigs;
        this.radius = 120;
        this.height = 300;
        this.width = 300;
        this.circularFigureBPTrackOptions = new CircularFigureBPTrackOptions();
        for(let i = 0; i != this.contigs.length; ++i)
        {
            this.contigs[i].color = getRandColor(1);
        }
        //Add filler contig at the end of the reference so the figure displays correctly
        if(this.contigs.length == 1)
        {
            this.contigs.push(new Contig());
            this.contigs[1].color = this.contigs[0].color;
            this.contigs[1].uuid = "filler";
            this.contigs[1].bp = 1;
            this.contigs[1].loaded = true;
        }
        cacheBaseFigure(this);
    }
}
export function renderBaseFigure(figure : CircularFigure) : string
{
    return `
        ${plasmidTrack.add(
        {
            trackStyle : "fill:#f0f0f0;stroke:#ccc",
            radius : "{{genome.radius}}"
        })}
            ${trackLabel.add(
            {
                text : figure.contigs[0].name,
                labelStyle : "font-size:20px;font-weight:400"
            })}
            ${trackLabel.end()}
            ${(()=>
            {
                let res = "";
                let lastLocation = 0;
                for(let i = 0; i != figure.contigs.length; ++i)
                { 
                    res += `
                        ${trackMarker.add(
                        {
                            start : lastLocation.toString(),
                            end : (lastLocation + figure.contigs[i].bp).toString(),
                            markerStyle : `fill:${figure.contigs[i].color}`,
                            uuid : figure.contigs[i].uuid,
                            onClick : "markerOnClick"
                        })}
                            ${markerLabel.add(
                            {
                                type : "path",
                                text : figure.contigs[i].name
                            })}
                            ${markerLabel.end()}
                        ${trackMarker.end()}
                    `;
                    lastLocation = lastLocation + figure.contigs[i].bp;
                }
                return res; 
            })()}
            ${trackScale.add(
            {
                interval : "{{genome.circularFigureBPTrackOptions.interval}}",
                vAdjust : "{{genome.circularFigureBPTrackOptions.vAdjust}}",
                showLabels : "{{genome.circularFigureBPTrackOptions.showLabels}}"
            }
        )}
        ${trackScale.end()}
    ${plasmidTrack.end()}
    `;
}
export function cacheBaseFigure(figure : CircularFigure) : void
{
    try
    {
        fs.mkdirSync(`resources/app/rt/circularFigures/${figure.uuid}`);
    }
    catch(err){}
    fs.writeFileSync(`resources/app/rt/circularFigures/${figure.uuid}/baseFigure`,renderBaseFigure(figure));
}
export function getBaseFigureFromCache(figure : CircularFigure) : string
{
    return (<any>fs.readFileSync(`resources/app/rt/circularFigures/${figure.uuid}/baseFigure`));
}

export function cacheCoverageTracks(figure : CircularFigure,coverageFile : string,cb : (status : boolean) => void) : void
{
    try
    {
        fs.mkdirSync(`resources/app/rt/circularFigures/${figure.uuid}`);
    }
    catch(err){}
}