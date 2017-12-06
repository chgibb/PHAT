/// <reference path="../../../node_modules/@chgibb/ngplasmid/lib/html" />
/// <reference path="../../../node_modules/@chgibb/ngplasmid/lib/directives" />
/// <reference path="../../../node_modules/@chgibb/ngplasmid/lib/services" />
/// <reference path="../../../node_modules/@chgibb/ngplasmid/lib/interpolate" />
/// <reference path="../../../node_modules/@chgibb/ngplasmid/lib/directiveToPB" />
/// <reference path="../../../node_modules/@chgibb/ngplasmid/lib/pb/node.d.ts" />


import * as fs from "fs";
import * as readline from "readline";

const jsonFile = require("jsonfile");
const uuidv4 : () => string = require("uuid/v4");
const mkdirp = require("mkdirp");
import * as html from "@chgibb/ngplasmid/lib/html";
import * as ngDirectives from "@chgibb/ngplasmid/lib/directives";
import * as pbDirectives from "@chgibb/ngplasmid/lib/pb/node";
import {plasmidToPB} from "@chgibb/ngplasmid/lib/directiveToPB";

import {getReadableAndWritable} from "./../getAppPath";
import * as fastaContigLoader from "./../fastaContigLoader";
import * as plasmidTrack from "./circularGenome/plasmidTrack";
import * as trackLabel from "./circularGenome/trackLabel";
import * as trackMarker from "./circularGenome/trackMarker";
import * as markerLabel from "./circularGenome/markerLabel";
import * as trackScale from "./circularGenome/trackScale";

import * as plasmid from "./circularGenome/plasmid";

import {AlignData,getSNPsJSON} from "./../alignData";
import {VCF2JSONRow} from "./../varScanMPileup2SNPVCF2JSON";

/**
 * Represents a single contig in a circular figure
 * 
 * @export
 * @class Contig
 * @extends {fastaContigLoader.Contig}
 */
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
/**
 * Hydrates contig with the appropriate properties for display
 * 
 * @export
 * @param {Contig} contig 
 * @param {boolean} [allowPositionChange=false] 
 */
export function initContigForDisplay(contig : Contig,allowPositionChange = false) : void
{
    contig.color = getRandColor(1);
    contig.opacity = 1.0;
    contig.fontFill = "rgb(0,0,0)";
    contig.allowPositionChange = allowPositionChange;
    contig.vAdjust = 0;
}

/**
 * Returns a random RGB value of the form rgb(r,g,b)
 * 
 * @param {number} brightness 
 * @returns 
 */
function getRandColor(brightness : number)
{
    //adapted from answer by letronje and edited by Peter Mortensen
    //http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript

    // Six levels of brightness from 0 to 5, 0 being the darkest
    let rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
    let mix = [brightness*51, brightness*51, brightness*51]; //51 => 255/5
    let mixedrgb = [rgb[0] + mix[0], rgb[1] + mix[1], rgb[2] + mix[2]].map(function(x){return Math.round(x/2.0)});
    return "rgb(" + mixedrgb.join(",") + ")";
}

/**
 * Specifies options options for a figure's interval track
 * 
 * @export
 * @class CircularFigureBPTrackOptions
 */
export class CircularFigureBPTrackOptions
{
    public interval : number;
    public vAdjust : number;
    public showLabels : 0 | 1;
    public direction : "in" | "out";
    constructor()
    {
        this.interval = 500;
        this.vAdjust = 5;
        this.showLabels = 0;
        this.direction = "out";
    }
}

/**
 * Contains a record to retrieve/manipulate a data track which has been rendered
 * 
 * @export
 * @class RenderedTrackRecord
 */
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
        colour : string)
        {
            this.uuid = uuidv4();
            this.uuidAlign = uuidAlign;
            this.uuidContig = uuidContig;
            this.uuidFigure = uuidFigure;
            this.checked = false;
            this.colour = colour;
        }
}

/**
 * Contains a record to retrieve/manipulate a coverage track which has been built
 * 
 * @export
 * @class RenderedCoverageTrackRecord
 * @extends {RenderedTrackRecord}
 */
export class RenderedCoverageTrackRecord extends RenderedTrackRecord
{
    scaleFactor : number;
    public constructor(
        uuidAlign : string,
        uuidContig : string,
        uuidFigure : string,
        colour : string,
        scaleFactor : number)
    {
        super(uuidAlign,uuidContig,uuidFigure,colour);
        this.scaleFactor = scaleFactor;
    }
}

/**
 * Contains a record to retrieve/manipulate a SNP track which has been built
 * 
 * @export
 * @class RenderedSNPTrackRecord
 * @extends {RenderedTrackRecord}
 */
export class RenderedSNPTrackRecord extends RenderedTrackRecord
{
    public constructor(
        uuidAlign : string,
        uuidContig : string,
        uuidFigure : string,
        colour : string)
    {
        super(uuidAlign,uuidContig,uuidFigure,colour);
    }
}

/**
 * Contains all structures needed to manipulate a circular figure
 * 
 * @export
 * @class CircularFigure
 */
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
    public zoomFactor : number;
    public isInteractive : boolean;
    public showContigNames : boolean;
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
        this.zoomFactor = 1;
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
        this.isInteractive = true;
        this.showContigNames = true;
        let totalBP = 0;
        for(let i = 0; i != this.contigs.length; ++i)
        {
            totalBP += this.contigs[i].bp;
        }
        if(this.contigs.length >= 50 || totalBP >= 1000000)
        {
            this.isInteractive = false;
            this.showContigNames = false;
        }
        cacheBaseFigureTemplate(this);
    }
}

/**
 * Minimum amount of props/methods expected by figures at runtime
 * 
 * @export
 * @abstract
 * @class FigureCanvas
 */
export abstract class FigureCanvas
{
    public genome : CircularFigure;
    public scope : FigureCanvas;
    public abstract markerOnClick($event : any,$marker : any,uuid : string) : void;
    public abstract figureNameOnClick() : void;
    public abstract updateScope(scope? : FigureCanvas) : void
}

/**
 * Returns the templates for contig
 * 
 * @export
 * @param {Contig} contig 
 * @param {number} [start=-1] 
 * @param {number} [end=-1] 
 * @returns {string} 
 */
export function buildContigTemplate(figure : CircularFigure,contig : Contig,start : number = -1,end : number = -1) : string
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
            onClick : "markerOnClick",
            isInteractive : figure.isInteractive
        })}
            ${markerLabel.add(
            {
                type : "path",
                text : figure.showContigNames ?  contig.alias : "",
                labelStyle : `fill:${contig.fontFill};opacity:${contig.opacity};`
            })}
            ${markerLabel.end()}
        ${trackMarker.end()}
    `;
    return res;
}

/**
 * Returns the templates for the base figure of figure
 * 
 * @export
 * @param {CircularFigure} figure 
 * @returns {string} 
 */
export function buildBaseFigureTemplate(figure : CircularFigure) : string
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
                onClick : "figureNameOnClick",
                isInteractive : figure.isInteractive
            })}
            ${trackLabel.end()}
            ${(()=>
            {
                let res = "";
                let lastLocation = 0;
                for(let i = 0; i != figure.contigs.length; ++i)
                {
                    res += buildContigTemplate(figure,figure.contigs[i],lastLocation,lastLocation+figure.contigs[i].bp);
                    lastLocation = lastLocation + figure.contigs[i].bp;
                }
                for(let i = 0; i != figure.customContigs.length; ++i)
                {
                    res += buildContigTemplate(figure,figure.customContigs[i],figure.customContigs[i].start,figure.customContigs[i].end);
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

/**
 * Overwrites the current disk template cache for the base figure of figure
 * 
 * @export
 * @param {CircularFigure} figure 
 */
export function cacheBaseFigureTemplate(figure : CircularFigure) : void
{
    try
    {
        fs.mkdirSync(getReadableAndWritable(`rt/circularFigures/${figure.uuid}`));
    }
    catch(err){}
    fs.writeFileSync(getReadableAndWritable(`rt/circularFigures/${figure.uuid}/baseFigure`),buildBaseFigureTemplate(figure));
}

/**
 * Overwrites the current disk SVG cache for the base figure of figure
 * 
 * @export
 * @param {CircularFigure} figure 
 * @param {string} svg 
 */
export function cacheBaseFigureSVG(figure : CircularFigure,svg : string) : void
{
    fs.writeFileSync(getReadableAndWritable(`rt/circularFigures/${figure.uuid}/baseFigure.svg`),svg);
}

/**
 * Returns the current disk template cache contents for the base figure of figure
 * 
 * @export
 * @param {CircularFigure} figure 
 * @returns {string} 
 */
export function getBaseFigureTemplateFromCache(figure : CircularFigure) : string
{
    return (<any>fs.readFileSync(getReadableAndWritable(`rt/circularFigures/${figure.uuid}/baseFigure`)));
}

/**
 * Returns the current disk SVG cache for the base figure of figure
 * 
 * @export
 * @param {CircularFigure} figure 
 * @returns {string} 
 */
export function getBaseFigureSVGFromCache(figure : CircularFigure) : string
{
    return fs.readFileSync(getReadableAndWritable(`rt/circularFigures/${figure.uuid}/baseFigure.svg`)).toString();
}

/**
 * Deletes the contents of the current disk SVG cache for the base figure of figure
 * 
 * @export
 * @param {CircularFigure} figure 
 */
export function deleteBaseFigureSVGFromCache(figure : CircularFigure) : void
{
    try
    {
        fs.unlinkSync(getReadableAndWritable(`rt/circularFigures/${figure.uuid}/baseFigure.svg`));
    }
    catch(err){}
}
/**
 * Compile base figure. Returns the resulting SVG
 * 
 * @export
 * @param {CircularFigure} figure 
 * @returns {Promise<string>} 
 */
export function compileBaseFigureSVG(figure : CircularFigure) : Promise<string>
{
    return new Promise<string>(async (resolve,reject) => {

        let nodes : Array<html.Node> = await html.loadFromString(
            assembleCompilableBaseFigureTemplates(figure)
        );

        let plasmid : ngDirectives.Plasmid = new ngDirectives.Plasmid();
        plasmid.$scope = {
            genome : figure
        };

        for(let i = 0; i != nodes.length; ++i)
        {
            if(nodes[i].name == "div")
            {
                for(let k = 0; k != nodes[i].children.length; ++k)
                {
                    if(nodes[i].children[k].name == "plasmid")
                    {
                        plasmid.fromNode<html.Node>(nodes[i].children[k]);
                        break;
                    }
                }
            }
        }
        resolve(plasmid.renderStart()+plasmid.renderEnd());
    });
}

/**
 * Returns the distance from the begginning of the figure to the begginning of the contig specified by contiguuid
 * 
 * @param {CircularFigure} figure 
 * @param {string} contiguuid 
 * @returns {number} 
 */
function getBaseBP(figure : CircularFigure,contiguuid : string) : number
{
    //Walk the figures contigs clockwise and return the offset of the beginning of contig specified
    //by contiguuid from the start of the figure
    let base = 0;
    for(let i = 0; i != figure.contigs.length; ++i)
    {
        if(figure.contigs[i].uuid == contiguuid)
            return base;
        base += figure.contigs[i].bp;
    }
    return -1;
}

/**
 * Group coverage depths by nucleotide position
 * 
 * @interface PositionsWithDepths
 */
interface PositionsWithDepths
{
    depth : number;
    positions : Array<number>;
}


/**
 * Returns the templates for a coverage track of align for the contig specified by contiguuid on figure in the specified colour
 * 
 * @export
 * @param {CircularFigure} figure 
 * @param {string} contiguuid 
 * @param {AlignData} align 
 * @param {string} [colour="rgb(64,64,64)"] 
 * @param {number} [scaleFactor=1] 
 * @returns {Promise<string>} 
 */
export async function buildCoverageTrackTemplate(
    figure : CircularFigure,
    contiguuid : string,
    align : AlignData,
    colour : string = "rgb(64,64,64)",
    scaleFactor : number = 1
) : Promise<string>
{
    return new Promise<string>((resolve,reject) => {
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
                res += `<plasmidtrack trackstyle="fill-opacity:0.0;fill:${colour}" width="10" radius="{{genome.radius+${100+(depths[i].depth*scaleFactor)}}}" >`;
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
            resolve(coverageTracks);
        });
    });
}


/**
 * Returns the templates for a coverage track of align for the contig specified by contiguuid on figure in the specified colour. Creates and saves a trackrecord
 * on figure with the results
 * 
 * @export
 * @param {CircularFigure} figure 
 * @param {string} contiguuid 
 * @param {AlignData} align 
 * @param {string} [colour="rgb(64,64,64)"] 
 * @param {number} [scaleFactor=1] 
 * @returns {Promise<string>} 
 */
export async function cacheCoverageTrackTemplate(
    figure : CircularFigure,
    contiguuid : string,
    align : AlignData,
    colour : string = "rgb(64,64,64)",
    scaleFactor : number = 1
) : Promise<string>
{
    return new Promise<string>(async (resolve,reject) => {
        try
        {
            mkdirp.sync(getReadableAndWritable(`rt/circularFigures/${figure.uuid}/coverage/${align.uuid}/${contiguuid}`));
        }
        catch(err){}
    
        let coverageTracks = await buildCoverageTrackTemplate(figure,contiguuid,align,colour,scaleFactor);
        let trackRecord = new RenderedCoverageTrackRecord(align.uuid,contiguuid,figure.uuid,colour,scaleFactor);
        fs.writeFileSync(getCachedCoverageTrackTemplatePath(trackRecord),coverageTracks);
        figure.renderedCoverageTracks.push(trackRecord);
        resolve(coverageTracks);
    });
}

/**
 * Returns the path to the template cache for the specified coverage track
 * 
 * @export
 * @param {RenderedCoverageTrackRecord} trackRecord 
 * @returns {string} 
 */
export function getCachedCoverageTrackTemplatePath(trackRecord : RenderedCoverageTrackRecord) : string
{
    return getReadableAndWritable(`rt/circularFigures/${trackRecord.uuidFigure}/coverage/${trackRecord.uuidAlign}/${trackRecord.uuidContig}/${trackRecord.uuid}`);
}

/**
 * Returns the path to the SVG cache for the specified coverage track
 * 
 * @export
 * @param {RenderedCoverageTrackRecord} trackRecord 
 * @returns {string} 
 */
export function getCachedCoverageTrackSVGPath(trackRecord : RenderedCoverageTrackRecord) : string
{
    return getReadableAndWritable(`rt/circularFigures/${trackRecord.uuidFigure}/coverage/${trackRecord.uuidAlign}/${trackRecord.uuidContig}/${trackRecord.uuid}.svg`);
}

/**
 * Overwrites the disk SVG cache for the specified coverage track
 * 
 * @export
 * @param {RenderedCoverageTrackRecord} trackRecord 
 * @param {string} svg 
 */
export function cachCoverageTrackSVG(trackRecord : RenderedCoverageTrackRecord,svg : string) : void
{
    fs.writeFileSync(getCachedCoverageTrackSVGPath(trackRecord),svg);
}

/**
 * Returns the current SVG of the specified coverage track
 * 
 * @export
 * @param {RenderedCoverageTrackRecord} trackRecord 
 * @returns {string} 
 */
export function getCoverageTrackSVGFromCache(trackRecord : RenderedCoverageTrackRecord) : string
{
    return fs.readFileSync(getCachedCoverageTrackSVGPath(trackRecord)).toString();
}
/**
 * Returns the path to the protocol buffer cache for the specified coverage track
 * 
 * @export
 * @param {RenderedCoverageTrackRecord} trackRecord 
 * @returns {string} 
 */
export function getCoverageTrackPBPath(trackRecord : RenderedCoverageTrackRecord) : string
{
    return getReadableAndWritable(`rt/circularFigures/${trackRecord.uuidFigure}/coverage/${trackRecord.uuidAlign}/${trackRecord.uuidContig}/${trackRecord.uuid}.pb`);
}
/**
 * Returns the disk protocol buffer cache for the specified coverage track
 * 
 * @export
 * @param {RenderedCoverageTrackRecord} trackRecord 
 * @returns {Buffer} 
 */
export function getCoverageTrackPBFromCache(trackRecord : RenderedCoverageTrackRecord) : Buffer
{
    return fs.readFileSync(getCoverageTrackPBPath(trackRecord));
}
/**
 * Overwrites the disk protocol buffer cache for the specified coverage track
 * 
 * @export
 * @param {RenderedCoverageTrackRecord} trackRecord 
 * @param {ngDirectives.Plasmid} plasmid 
 */
export function cacheCoverageTrackPB(trackRecord : RenderedCoverageTrackRecord,plasmid : ngDirectives.Plasmid) : void
{
    let pb = pbDirectives.Node.create(plasmidToPB(plasmid));
    fs.writeFileSync(getCoverageTrackPBPath(trackRecord),pbDirectives.Node.encode(pb).finish());
}

/**
 * Holds information relevant to display for a given SNP
 * 
 * @interface SNPPosition
 */
interface SNPPosition
{
    position : number;
    relativePosition : number;
    from : string;
    to : string;
    colour : string
    adjust : number;
}

/**
 * Returns the templates for a SNP track of align for the contig specified by contiguuid on figure in the specified colour
 * 
 * @export
 * @param {CircularFigure} figure 
 * @param {string} contiguuid 
 * @param {AlignData} align 
 * @param {string} [colour="rgb(64,64,64)"] 
 * @returns {Promise<string>} 
 */
export function buildSNPTrackTemplate(
    figure : CircularFigure,
    contiguuid : string,
    align : AlignData,
    colour : string = "rgb(64,64,64)"
) : Promise<string>
{
    return new Promise<string>((resolve,reject) => {
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
        resolve(SNPTracks);
    });

}

/**
 * Returns the templates for a SNP track of align for the contig specified by contiguuid on figure in the specified colour. Creates and saves a trackrecord
 * on figure with the results
 * 
 * @export
 * @param {CircularFigure} figure 
 * @param {string} contiguuid 
 * @param {AlignData} align 
 * @param {string} [colour="rgb(64,64,64)"] 
 * @returns {Promise<string>} 
 */
export function cacheSNPTrackTemplate(
    figure : CircularFigure,
    contiguuid : string,
    align : AlignData,
    colour : string = "rgb(64,64,64)"
) : Promise<string>
{
    return new Promise<string>(async (resolve,reject) => {
        try
        {
            mkdirp.sync(getReadableAndWritable(`rt/circularFigures/${figure.uuid}/snp/${align.uuid}/${contiguuid}`));
        }
        catch(err){}
        let SNPTracks = await buildSNPTrackTemplate(figure,contiguuid,align,colour);
        let trackRecord = new RenderedSNPTrackRecord(align.uuid,contiguuid,figure.uuid,colour);
        fs.writeFileSync(getCachedSNPTrackTemplatePath(trackRecord),SNPTracks);
        figure.renderedSNPTracks.push(trackRecord);
        resolve(SNPTracks);
    });
}

/**
 * Returns the path to the template cache for the specified SNP track
 * 
 * @export
 * @param {RenderedSNPTrackRecord} trackRecord 
 * @returns {string} 
 */
export function getCachedSNPTrackTemplatePath(trackRecord : RenderedSNPTrackRecord) : string
{
    return getReadableAndWritable(`rt/circularFigures/${trackRecord.uuidFigure}/snp/${trackRecord.uuidAlign}/${trackRecord.uuidContig}/${trackRecord.uuid}`);
}

/**
 * Returns the path to the SVG cache for the specified SNP track
 * 
 * @export
 * @param {RenderedSNPTrackRecord} trackRecord 
 * @returns {string} 
 */
export function getCachedSNPTrackSVGPath(trackRecord : RenderedSNPTrackRecord) : string
{
    return getReadableAndWritable(`rt/circularFigures/${trackRecord.uuidFigure}/snp/${trackRecord.uuidAlign}/${trackRecord.uuidContig}/${trackRecord.uuid}.svg`);
}

/**
 * Overwrites the disk SVG cache for the specified SNP track
 * 
 * @export
 * @param {RenderedSNPTrackRecord} trackRecord 
 * @param {string} svg 
 */
export function cacheSNPTrackSVG(trackRecord : RenderedSNPTrackRecord,svg : string) : void
{
    fs.writeFileSync(getCachedSNPTrackSVGPath(trackRecord),svg);
}

/**
 * Returns the current SVG of the specified SNP track
 * 
 * @export
 * @param {RenderedSNPTrackRecord} trackRecord 
 * @returns {string} 
 */
export function getSNPTrackSVGFromCache(trackRecord : RenderedSNPTrackRecord) : string
{
    return fs.readFileSync(getCachedSNPTrackSVGPath(trackRecord)).toString();
}

/**
 * Compile trackRecord against figure. Returns the resulting SVG
 * 
 * @export
 * @param {RenderedCoverageTrackRecord} trackRecord 
 * @param {CircularFigure} figure 
 * @returns {Promise<string>} 
 */
export function compileCoverageTrackSVG(trackRecord : RenderedCoverageTrackRecord,figure : CircularFigure) : Promise<string>
{

    return new Promise<string>(async (resolve,reject) => {

        if(fs.existsSync(getCoverageTrackPBPath(trackRecord)))
        {
            let plasmid : ngDirectives.Plasmid = new ngDirectives.Plasmid();
            plasmid.$scope = {
                genome : figure
            };

            //build from protocol buffer
            plasmid.fromNode<any>(
                pbDirectives.Node.decode(
                    fs.readFileSync(
                        getCoverageTrackPBPath(trackRecord)
                    )
                )
            );
            resolve(plasmid.renderStart()+plasmid.renderEnd());
        }

        //first time compiling this track
        else
        {
            //construct map from html
            let nodes : Array<html.Node> = await html.loadFromString(
                assembleCompilableCoverageTrack(figure,trackRecord)
            );

            let plasmid : ngDirectives.Plasmid = new ngDirectives.Plasmid();
            plasmid.$scope = {
                genome : figure
            };
        
            for(let i = 0; i != nodes.length; ++i)
            {
                if(nodes[i].name == "div")
                {
                    for(let k = 0; k != nodes[i].children.length; ++k)
                    {
                        if(nodes[i].children[k].name == "plasmid")
                        {
                            plasmid.fromNode<html.Node>(nodes[i].children[k]);
                            break;
                        }
                    }
                }
            }
            //write optimized protocol buffer version for future compiles
            cacheCoverageTrackPB(trackRecord,plasmid);
            //since the map is already ready, compile and resolve the result
            resolve(plasmid.renderStart()+plasmid.renderEnd());
        }
    });

}

export function compileSNPTrackSVG(trackRecord : RenderedSNPTrackRecord,figure : CircularFigure) : Promise<string>
{

    return new Promise<string>(async (resolve,reject) => {

        let nodes : Array<html.Node> = await html.loadFromString(
            assembleCompilableSNPTrack(figure,trackRecord)
        );

        let plasmid : ngDirectives.Plasmid = new ngDirectives.Plasmid();
        plasmid.$scope = {
            genome : figure
        };

        for(let i = 0; i != nodes.length; ++i)
        {
            if(nodes[i].name == "div")
            {
                for(let k = 0; k != nodes[i].children.length; ++k)
                {
                    if(nodes[i].children[k].name == "plasmid")
                    {
                        plasmid.fromNode<html.Node>(nodes[i].children[k]);
                        break;
                    }
                }
            }
        }

        resolve(plasmid.renderStart()+plasmid.renderEnd());
    });
}

/**
 * Wraps templates with the correct markup, based on figure to make them compilable by Angular
 * 
 * @export
 * @param {CircularFigure} figure 
 * @param {string} templates 
 * @param {string} [id=""] 
 * @returns {string} 
 */
export function assembleCompilableTemplates(figure : CircularFigure,templates : string,id = "") : string
{
    let totalBP = 0;
    for(let i = 0; i != figure.contigs.length; ++i)
    {
        totalBP += figure.contigs[i].bp;
    }
    return `
        <div ${id ? `id="${id}"` : ""}>
        ${plasmid.add(
        {
            sequenceLength : totalBP.toString(),
            plasmidHeight : "{{genome.height}}",
            plasmidWidth : "{{genome.width}}"
        })}
            ${templates}
        ${plasmid.end()}
        </div>
    `;
}

/**
 * Returns templates for the base figure of figure able to be compiled by Angular
 * 
 * @export
 * @param {CircularFigure} figure 
 * @returns {string} 
 */
export function assembleCompilableBaseFigureTemplates(figure : CircularFigure) : string
{
    return assembleCompilableTemplates(figure,getBaseFigureTemplateFromCache(figure));
}

/**
 * Returns templates for the specified coverage track record of figure able to be compiled by Angular
 * 
 * @export
 * @param {CircularFigure} figure 
 * @param {RenderedCoverageTrackRecord} trackRecord 
 * @returns {string} 
 */
export function assembleCompilableCoverageTrack(figure : CircularFigure,trackRecord : RenderedCoverageTrackRecord) : string
{
    return assembleCompilableTemplates(
        figure,
        fs.readFileSync(
            getCachedCoverageTrackTemplatePath(trackRecord)
        ).toString()
    );
}

/**
 * Returns templates for the specified SNP track record of figure able to be compiled by Angular
 * 
 * @export
 * @param {CircularFigure} figure 
 * @param {RenderedSNPTrackRecord} trackRecord 
 * @returns {string} 
 */
export function assembleCompilableSNPTrack(figure : CircularFigure,trackRecord : RenderedSNPTrackRecord) : string
{
    return assembleCompilableTemplates(
        figure,
        fs.readFileSync(
            getCachedSNPTrackTemplatePath(trackRecord)
        ).toString()
    );
}
