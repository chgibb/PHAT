import * as fs from "fs";
import * as readline from "readline";
const uuidv4 : () => string = require("uuid/v4");
import * as mkdirp from "mkdirp";
import * as fastaContigLoader from "./../fastaContigLoader";
import * as plasmidTrack from "./circularGenome/plasmidTrack";
import * as trackLabel from "./circularGenome/trackLabel";
import * as trackMarker from "./circularGenome/trackMarker";
import * as markerLabel from "./circularGenome/markerLabel";
import * as trackScale from "./circularGenome/trackScale";

import alignData from "./../alignData";
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
export class RenderedCoverageTrackRecord
{
    public uuid : string;
    public uuidAlign : string;
    public uuidContig : string;
    public uuidFigure : string;
    public path : string;
    public checked : boolean;
    public colour : string;
    public constructor(
        uuidAlign : string,
        uuidContig : string,
        uuidFigure : string,
        colour : string,
        path : string)
        {
            this.uuid = uuidv4();
            this.uuidAlign = uuidAlign;
            this.uuidContig = uuidContig;
            this.uuidFigure = uuidFigure;
            this.path = path;
            this.checked = false;
            this.colour = colour;
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
    public renderedCoverageTracks : Array<RenderedCoverageTrackRecord>;
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
        this.renderedCoverageTracks = new Array<RenderedCoverageTrackRecord>();
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
                text : figure.name,
                labelStyle : "font-size:20px;font-weight:400",
                onClick : "figureNameOnClick"
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
                                text : figure.contigs[i].alias
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

//Walk the figures contigs clockwise and return the offset of the beginning of contig specified
//by contiguuid from the start of the figure
function getBaseBP(figure : CircularFigure,contiguuid : string) : number
{
    let base = 0;
    for(let i = 0; i != figure.contigs.length; ++i)
    {
        if(figure.contigs[i].uuid == contiguuid)
            return base;
        base += figure.contigs[i].bp;
    }
    return -1;
}
interface PositionsWithDepths
{
    depth : number;
    positions : Array<number>;
}
export function renderCoverageTracks(figure : CircularFigure,contiguuid : string,align : alignData,cb : (status : boolean,coverageTracks : string) => void,colour : string = "rgb(64,64,64)") : void
{
    let coverageTracks : string = "";
    //Stream the distilled samtools depth data from the specified alignment for the specified contig
    let rl : readline.ReadLine = readline.createInterface(<readline.ReadLineOptions>{
        input : fs.createReadStream(`resources/app/rt/AlignmentArtifacts/${align.uuid}/contigCoverage/${contiguuid}`)
    });
    let baseBP = getBaseBP(figure,contiguuid);
    if(baseBP == -1)
        throw new Error("Could not get base position of "+figure.name+" for reference");

    /*
        Anular Plasmid tracks are declared in terms of y position. We want to group all positions with the same depth
        together so we can create one track for each depth and then render every position with the same depth onto
        the same track.
    */
    let depths : Array<PositionsWithDepths> = new Array<PositionsWithDepths>();
    rl.on("line",function(line : string){
        let tokens = line.split(/\s/g);
        let depth = parseInt(tokens[1]);
        let found = false;
        for(let i = 0; i != depths.length; ++i)
        {
            if(depths[i].depth == depth)
            {
                depths[i].positions.push(parseInt(tokens[0]));
                found = true;
                break;
            }
        }
        if(!found)
        {
            depths.push(<PositionsWithDepths>{
                depth : depth,
                positions : <Array<number>>[parseInt(tokens[0])]
            });
        }
    });
    rl.on("close",function(){
        //sort depths
        depths.sort(function(a : PositionsWithDepths,b : PositionsWithDepths){return a.depth - b.depth;});

        /*
            Instead of rendering one marker for every single position, we stretch a single marker to cover sequential positions which are all at the same
            depth.
        */
        for(let i = 0; i != depths.length; ++i)
        {
            //sort positions within each depth position we're looking at
            depths[i].positions.sort(function(a : number,b : number){return a - b});
            let res = "";
            //render the start of the current track
            res += `<plasmidtrack trackstyle="fill-opacity:0.0" width="10" radius="{{genome.radius+${100+i}}}" >`;
            //try to find a group of sequential positions
            for(let k = 0; k != depths[i].positions.length; ++k)
            {
                let offset = 1;
                let prev = depths[i].positions[k];
                let initial = k; 
                while(depths[i].positions[k + offset] == depths[i].positions[initial] + offset)
                {
                    if(k + offset == depths[i].positions.length)
                        break;
                    offset++;
                }
                //in case we didn't find any sequential positions, this will render singles fine
                k = k + (offset - 1);
                res += `<trackmarker start="${baseBP+depths[i].positions[initial]}" end="${baseBP+depths[i].positions[initial]+offset}" markerstyle="fill:${colour};stroke-width:1px;" wadjust="-8"></trackmarker>`;
            }
            res += `</plasmidtrack>`;
            coverageTracks += res;
        }
        cb(true,coverageTracks);
    });
}
export function cacheCoverageTracks(figure : CircularFigure,contiguuid : string,align : alignData,cb : (status : boolean,coverageTracks : string) => void,colour : string = "rgb(64,64,64)") : void
{
    try
    {
        mkdirp.sync(`resources/app/rt/circularFigures/${figure.uuid}/coverage/${align.uuid}`);
    }
    catch(err){}
    renderCoverageTracks(
        figure,
        contiguuid,
        align,
        function(status,coverageTracks){
            fs.writeFileSync(`resources/app/rt/circularFigures/${figure.uuid}/coverage/${align.uuid}/${contiguuid}`,coverageTracks);
            if(status == true)
            {
                figure.renderedCoverageTracks.push(
                    new RenderedCoverageTrackRecord(
                        align.uuid,
                        contiguuid,
                        figure.uuid,
                        colour,
                        `resources/app/rt/circularFigures/${figure.uuid}/coverage/${align.uuid}/${contiguuid}`
                    )
                );
            }
            cb(status,coverageTracks);
    });
}
 