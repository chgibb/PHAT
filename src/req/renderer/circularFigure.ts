import * as fs from "fs";
import * as readline from "readline";

const jsonFile = require("jsonfile");
const uuidv4 : () => string = require("uuid/v4");
import * as mkdirp from "mkdirp";

import {getReadableAndWritable} from "./../getAppPath";
import * as fastaContigLoader from "./../fastaContigLoader";
import * as plasmidTrack from "./circularGenome/plasmidTrack";
import * as trackLabel from "./circularGenome/trackLabel";
import * as trackMarker from "./circularGenome/trackMarker";
import * as markerLabel from "./circularGenome/markerLabel";
import * as trackScale from "./circularGenome/trackScale";

import {alignData,getSNPsJSON} from "./../alignData";
import {VCF2JSONRow} from "./../varScanMPileup2SNPVCF2JSON";
export class Contig extends fastaContigLoader.Contig
{
    public color? : string = "";
    public opacity? : number = 1.0;
    public fontSize? : string = "";
    public fontWeight? : string = "";
    public fontFill? : string = "";
    public allowPositionChange? : boolean = false;
    public start? : number;
    public end? : number;
    public vAdjust? : number;
}
export function initContigForDisplay(contig : Contig,allowPositionChange = false) : void
{
    contig.color = getRandColor(1);
    contig.opacity = 1.0;
    contig.fontFill = "rgb(0,0,0)";
    contig.allowPositionChange = allowPositionChange;
    contig.vAdjust = 0;
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
    public direction : string;
    constructor()
    {
        this.interval = 500;
        this.vAdjust = 5;
        this.showLabels = 0;
        this.direction = "out";
    }
}
export class RenderedTrackRecord
{
    public uuid : string;
    public uuidAlign : string;
    public uuidContig : string;
    public uuidFigure : string;
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
            this.checked = false;
            this.colour = colour;
        }
}
export class RenderedCoverageTrackRecord extends RenderedTrackRecord
{
    public constructor(
        uuidAlign : string,
        uuidContig : string,
        uuidFigure : string,
        colour : string,
        path : string
    )
    {
        super(uuidAlign,uuidContig,uuidFigure,colour,path);
    }
}
export class RenderedSNPTrackRecord extends RenderedTrackRecord
{
    public constructor(
        uuidAlign : string,
        uuidContig : string,
        uuidFigure : string,
        colour : string,
        path : string
    )
    {
        super(uuidAlign,uuidContig,uuidFigure,colour,path);
    }
}
export class CircularFigure
{
    public uuid : string;
    public uuidFasta : string;
    public name : string;
    public contigs : Array<Contig>;
    public customContigs : Array<Contig>;
    public radius : number;
    public height : number;
    public width : number;
    public circularFigureBPTrackOptions : CircularFigureBPTrackOptions;
    public renderedCoverageTracks : Array<RenderedCoverageTrackRecord>;
    public renderedSNPTracks : Array<RenderedSNPTrackRecord>;
    constructor(name : string,uuid : string,contigs : Array<Contig>)
    {
        this.uuidFasta = uuid;
        this.uuid = uuidv4();
        this.name = name;
        this.contigs = contigs;
        this.radius = 120;
        this.height = this.radius*10;
        this.width = this.radius*10;
        this.circularFigureBPTrackOptions = new CircularFigureBPTrackOptions();
        this.renderedCoverageTracks = new Array<RenderedCoverageTrackRecord>();
        this.renderedSNPTracks = new Array<RenderedSNPTrackRecord>();
        for(let i = 0; i != this.contigs.length; ++i)
        {
            initContigForDisplay(this.contigs[i]);
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
        this.customContigs = new Array<Contig>();
        cacheBaseFigure(this);
    }
}
export function renderContig(contig : Contig,start : number = -1,end : number = -1) : string
{
    if(start == -1)
        start = contig.start;
    if(end == -1)
        end = contig.end;
    let res = "";
    res += `
        ${trackMarker.add(
        {
            start : start.toString(),
            end : end.toString(),
            vAdjust : contig.vAdjust,
            markerStyle : `fill:${contig.color};opacity:${contig.opacity};`,
            uuid : contig.uuid,
            onClick : "markerOnClick"
        })}
            ${markerLabel.add(
            {
                type : "path",
                text : contig.alias,
                labelStyle : `fill:${contig.fontFill};opacity:${contig.opacity};`
            })}
            ${markerLabel.end()}
        ${trackMarker.end()}
    `;
    return res;
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
                    res += renderContig(figure.contigs[i],lastLocation,lastLocation+figure.contigs[i].bp);
                    lastLocation = lastLocation + figure.contigs[i].bp;
                }
                for(let i = 0; i != figure.customContigs.length; ++i)
                {
                    res += renderContig(figure.customContigs[i],figure.customContigs[i].start,figure.customContigs[i].end);
                }
                return res; 
            })()}
            ${trackScale.add(
            {
                interval : "{{genome.circularFigureBPTrackOptions.interval}}",
                vAdjust : "{{genome.circularFigureBPTrackOptions.vAdjust}}",
                showLabels : "{{genome.circularFigureBPTrackOptions.showLabels}}",
                direction : "{{genome.circularFigureBPTrackOptions.direction}}"
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
        fs.mkdirSync(getReadableAndWritable(`rt/circularFigures/${figure.uuid}`));
    }
    catch(err){}
    fs.writeFileSync(getReadableAndWritable(`rt/circularFigures/${figure.uuid}/baseFigure`),renderBaseFigure(figure));
}
export function getBaseFigureFromCache(figure : CircularFigure) : string
{
    return (<any>fs.readFileSync(getReadableAndWritable(`rt/circularFigures/${figure.uuid}/baseFigure`)));
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
export function renderCoverageTrack(
    figure : CircularFigure,
    contiguuid : string,
    align : alignData,
    cb : (status : boolean,coverageTracks : string) => void
    ,colour : string = "rgb(64,64,64)"
) : void
{
    let coverageTracks : string = "";
    //Stream the distilled samtools depth data from the specified alignment for the specified contig
    let rl : readline.ReadLine = readline.createInterface(<readline.ReadLineOptions>{
        input : fs.createReadStream(getReadableAndWritable(`rt/AlignmentArtifacts/${align.uuid}/contigCoverage/${contiguuid}`))
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
            res += `<plasmidtrack trackstyle="fill-opacity:0.0;fill:${colour}" width="10" radius="{{genome.radius+${100+depths[i].depth}}}" >`;
            //try to find a group of sequential positions
            for(let k = 0; k != depths[i].positions.length; ++k)
            {
                let offset = 1;
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
export function cacheCoverageTrack(
    figure : CircularFigure,
    contiguuid : string,
    align : alignData,
    cb : (status : boolean,coverageTracks : string) => void,
    colour : string = "rgb(64,64,64)"
) : void
{
    try
    {
        mkdirp.sync(getReadableAndWritable(`rt/circularFigures/${figure.uuid}/coverage/${align.uuid}/${contiguuid}`));
    }
    catch(err){}
    renderCoverageTrack(
        figure,
        contiguuid,
        align,
        function(status,coverageTracks){
            if(status == true)
            {
                let trackRecord = new RenderedCoverageTrackRecord(align.uuid,contiguuid,figure.uuid,colour,"");
                fs.writeFileSync(getCachedCoverageTrackPath(trackRecord),coverageTracks);
                figure.renderedCoverageTracks.push(trackRecord);
            }
            cb(status,coverageTracks);
    },colour);
}

export function getCachedCoverageTrackPath(trackRecord : RenderedCoverageTrackRecord) : string
{
    return getReadableAndWritable(`rt/circularFigures/${trackRecord.uuidFigure}/coverage/${trackRecord.uuidAlign}/${trackRecord.uuidContig}/${trackRecord.uuid}`);
}

interface SNPPosition
{
    position : number;
    relativePosition : number;
    from : string;
    to : string;
    colour : string
    adjust : number;
}

export function renderSNPTrack(
    figure : CircularFigure,
    contiguuid : string,
    align : alignData,
    cb : (status : boolean,SNPTracks : string) => void
    ,colour : string = "rgb(64,64,64)"
) : void
{
    let SNPTracks : string = "";

    let baseBP = getBaseBP(figure,contiguuid);
    if(baseBP == -1)
        throw new Error("Could not get base position of "+figure.name+" for reference");

    let SNPPositions : Array<SNPPosition> = new Array<SNPPosition>();

    let SNPs : Array<VCF2JSONRow>;
    SNPs = jsonFile.readFileSync(getSNPsJSON(align));

    let contigName = "";

    for(let i = 0; i != figure.contigs.length; ++i)
    {
        if(figure.contigs[i].uuid == contiguuid)
        {
            contigName = figure.contigs[i].name;
            break;
        }
    }

    for(let i = 0; i != SNPs.length; ++i)
    {
        if(SNPs[i].chrom == (contigName.split(/\s/g))[0])
        {
            SNPPositions.push(<SNPPosition>{
                position : baseBP + parseInt(SNPs[i].position),
                relativePosition : parseInt(SNPs[i].position),
                from : SNPs[i].ref,
                to : SNPs[i].var,
                adjust : 20,
                colour : colour
            });
        }
    }
    SNPPositions.sort(function(a : SNPPosition,b : SNPPosition){return a.position - b.position;});

    for(let i = 0; i != SNPPositions.length; ++i)
    {
        for(let k = 0; k != SNPPositions.length; ++k)
        {
            if(i != k && i < k)
            {
                if((SNPPositions[k].position - SNPPositions[i].position) <= 85)
                {
                    SNPPositions[k].adjust += 85;
                }
            }
        }
    }
    for(let i = 0; i != SNPPositions.length; ++i)
        {
            SNPTracks += `
                <plasmidtrack width="20" trackstyle="fill-opacity:0.0" radius="{{genome.radius}}">
                    <trackmarker start="${SNPPositions[i].position}" markerstyle="stroke:${SNPPositions[i].colour};stroke-dasharray:2,2;stroke-width:2px;" wadjust="{{genome.radius+${SNPPositions[i].adjust}}}">
                        <markerlabel style="font-size:20px;fill:${SNPPositions[i].colour}" text="${SNPPositions[i].from}${SNPPositions[i].relativePosition}${SNPPositions[i].to}" vadjust="{{genome.radius+${SNPPositions[i].adjust}}}"></markerlabel>
                    </trackmarker>
                </plasmidtrack> 
                `;
        }
        cb(true,SNPTracks);

}

export function cacheSNPTrack(
    figure : CircularFigure,
    contiguuid : string,
    align : alignData,
    cb : (status : boolean,SNPTracks : string) => void,
    colour : string = "rgb(64,64,64)"
) : void
{
    try
    {
        mkdirp.sync(getReadableAndWritable(`rt/circularFigures/${figure.uuid}/snp/${align.uuid}/${contiguuid}`));
    }
    catch(err){}
    renderSNPTrack(
        figure,
        contiguuid,
        align,
        function(status,SNPTracks){
            if(status == true)
            {
                let trackRecord = new RenderedSNPTrackRecord(align.uuid,contiguuid,figure.uuid,colour,"");
                fs.writeFileSync(getCachedSNPTrackPath(trackRecord),SNPTracks);
                figure.renderedSNPTracks.push(trackRecord);
            }
            cb(status,SNPTracks);
        },colour);
}

export function getCachedSNPTrackPath(trackRecord : RenderedSNPTrackRecord) : string
{
    return getReadableAndWritable(`rt/circularFigures/${trackRecord.uuidFigure}/snp/${trackRecord.uuidAlign}/${trackRecord.uuidContig}/${trackRecord.uuid}`);
}
