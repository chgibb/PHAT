import * as fs from "fs";
import * as readline from "readline";


import * as html from "./../ngplasmid/lib/html";

import * as pbDirectives from "./../ngplasmid/lib/pb/node";
import {plasmidToPB} from "./../ngplasmid/lib/directiveToPB";

import {UniquelyAddressable} from "../uniquelyAddressable";

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
import {parseCSS} from "./../parseCSS";
import { Plasmid } from '../ngplasmid/lib/plasmid';
import { TrackMarker } from '../ngplasmid/lib/trackMarker';

const mkdirp = require("mkdirp");
const uuidv4 : () => string = require("uuid/v4");
const jsonFile = require("jsonfile");

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
    let mixedrgb = [rgb[0] + mix[0], rgb[1] + mix[1], rgb[2] + mix[2]].map(function(x)
    {
        return Math.round(x/2.0);
    });
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
export class RenderedTrackRecord implements UniquelyAddressable
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
 * Properties used by sequence selector to display selection arms
 * 
 * @export
 * @class SeqSelectionDisplayArm
 */
export class SeqSelectionDisplayArm
{
    public armWidth : number;
    public armTrackStyle : string;
    public armRadius : number;
    public armStart : number;
    public armWadjust : number;
    public armMarkerClick : string;
    public armLineClass : string;
    public armLineStyle : string;
    public armShowLine : 0 | 1;
    public armVadjust : number;
    public armLabelClick : string;

    public constructor(side : "left" | "right",radius : number,armStart : number)
    {
        this.armWidth = 20;
        this.armTrackStyle = "fill-opacity:0.0;";
        this.armRadius = radius;
        this.armStart = armStart;
        this.armWadjust = 12;
        this.armMarkerClick = `seqSelectionArmOnClick($event,$handler,'${side}')`;
        this.armLineClass = "seqSelectionArm";
        this.armLineStyle = "stroke:rgb(0,0,0);stroke-dasharray:5,10;stroke-width:2px;animation: moveSeqSelectionArm 3s infinite;";
        this.armShowLine = 1;
        this.armVadjust = 1200;
        this.armLabelClick = this.armMarkerClick;
    }

}

/**
 * Properties used by sequence selector to display selection arrow
 * 
 * @export
 * @class SeqSelectionDisplayArrow
 */
export class SeqSelectionDisplayArrow
{
    public arrowTrackStyle : string;
    public arrowTrackRadius : number;
    public arrowStart : number;
    public arrowEnd : number;
    public arrowMarkerStyle : string;
    public arrowEndLength : number;
    public arrowEndWidth : number;
    public arrowType : string;
    public arrowClass : string;
    public arrowText : string;

    public constructor(start : number,end : number,radius : number)
    {
        this.arrowTrackStyle = "fill-opacity:0.0;";
        this.arrowTrackRadius = radius;
        this.arrowStart = start;
        this.arrowEnd = end;
        this.arrowMarkerStyle = "fill:rgba(0,0,0)";
        this.arrowEndLength = 10;
        this.arrowEndWidth = 5;
        this.arrowType = "path";
        this.arrowClass = "";
        this.updateText();
    }

    public updateText()
    {
        this.arrowText = `${this.arrowStart}-${this.arrowEnd}`;   
    }
}

export interface MapScope
{
    genome : CircularFigure;
    seqSelectionLeftArm : SeqSelectionDisplayArm;
    seqSelectionRightArm : SeqSelectionDisplayArm;
    seqSelectionArrow : SeqSelectionDisplayArrow;
}

export function makeMapScope(cf : CircularFigure, seqSelectOptions? : {
    start : number,
    end : number

}) : MapScope
{
    return <MapScope>{
        genome : cf,
        seqSelectionLeftArm : new SeqSelectionDisplayArm(
            "left",
            cf.radius,
            seqSelectOptions ? seqSelectOptions.start : 1
        ),
        seqSelectionRightArm : new SeqSelectionDisplayArm(
            "right",
            cf.radius,
            seqSelectOptions ? seqSelectOptions.end : 100
        ),
        seqSelectionArrow : new SeqSelectionDisplayArrow(
            seqSelectOptions ? seqSelectOptions.start : 1,
            seqSelectOptions ? seqSelectOptions.end : 100,
            cf.radius
        )
    };
}

export class TrackMap extends Plasmid
{
    public $scope : MapScope;
    public constructor()
    {
        super();
    }
}

export class CoverageTrackMap extends TrackMap
{
    public constructor()
    {
        super();
    }
}

export class SNPTrackMap extends TrackMap
{
    public constructor()
    {
        super();
    }
}

/**
 * Contains all structures needed to manipulate a circular figure
 * 
 * @export
 * @class CircularFigure
 */
export class CircularFigure implements UniquelyAddressable
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
export abstract class FigureCanvas implements MapScope
{
    public genome : CircularFigure;
    public seqSelectionLeftArm : SeqSelectionDisplayArm;
    public seqSelectionRightArm : SeqSelectionDisplayArm;
    public seqSelectionArrow : SeqSelectionDisplayArrow;
    public showSeqSelector : boolean;
    public scope : FigureCanvas;
    public abstract markerOnClick($event : any,$marker : any,uuid : string) : void;
    public abstract figureNameOnClick() : void;
    public abstract updateScope(scope? : FigureCanvas) : void;
    public abstract loadFigure(figure : CircularFigure) : void;
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

export function buildSequenceSelectorTemplate(figure : CircularFigure,
    seqSelectionLeftArm : SeqSelectionDisplayArm,
    seqSelectionRightArm : SeqSelectionDisplayArm,
    seqSelectionArrow : SeqSelectionDisplayArrow
) : string 
{

    let template = `
        <plasmidtrack width="{{seqSelectionLeftArm.armWidth}}" trackstyle="{{seqSelectionLeftArm.armTrackStyle}}" radius="{{seqSelectionLeftArm.armRadius}}">
            <trackmarker start="{{seqSelectionLeftArm.armStart}}" wadjust="{{seqSelectionLeftArm.armWadjust}}" markerclick="${seqSelectionLeftArm.armMarkerClick}">
                <markerlabel lineclass="{{seqSelectionLeftArm.armLineClass}}" linestyle="${seqSelectionLeftArm.armLineStyle}" showline="{{seqSelectionLeftArm.armShowLine}}" text="" vadjust="{{seqSelectionLeftArm.armVadjust}}" labelclick="${seqSelectionLeftArm .armLabelClick}"></markerlabel>
            </trackmarker>
        </plasmidtrack>
    `;

    template += `
        <plasmidtrack width="{{seqSelectionRightArm.armWidth}}" trackstyle="{{seqSelectionRightArm.armTrackStyle}}" radius="{{seqSelectionRightArm.armRadius}}">
            <trackmarker start="{{seqSelectionRightArm.armStart}}" wadjust="{{seqSelectionRightArm.armWadjust}}" markerclick="${seqSelectionRightArm.armMarkerClick}">
                <markerlabel lineclass="{{seqSelectionRightArm.armLineClass}}" linestyle="${seqSelectionRightArm.armLineStyle}" showline="{{seqSelectionRightArm.armShowLine}}" text="" vadjust="{{seqSelectionRightArm.armVadjust}}" labelclick="${seqSelectionRightArm .armLabelClick}"></markerlabel>
            </trackmarker>
        </plasmidtrack>
    `;

    template += `
        <plasmidtrack trackstyle="{{seqSelectionArrow.arrowTrackStyle}}" radius="{{seqSelectionArrow.arrowTrackRadius}}">
            <trackmarker start="{{seqSelectionArrow.arrowStart}}" end="{{seqSelectionArrow.arrowEnd}}" markerstyle="{{seqSelectionArrow.arrowMarkerStyle}}" arrowendlength="${seqSelectionArrow.arrowEndLength}" arrowendwidth="${seqSelectionArrow.arrowEndWidth}">
                <markerlabel type="path" class="seqSelectionArrowText" text="{{seqSelectionArrow.arrowText}}"></markerlabel>
            </trackmarker>
        </plasmidtrack>
    `;

    return template;
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
    catch(err)
    {}
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
    return fs.readFileSync(getReadableAndWritable(`rt/circularFigures/${figure.uuid}/baseFigure`)).toString();
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
    catch(err)
    {}
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
    return new Promise<string>(async (resolve,reject) => 
    {

        let nodes : Array<html.Node> = await html.loadFromString(
            assembleCompilableBaseFigureTemplates(figure)
        );

        let plasmid : Plasmid = new Plasmid();
        plasmid.$scope = makeMapScope(figure);

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
    return new Promise<string>((resolve,reject) => 
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
        rl.on("line",function(line : string)
        {
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
        rl.on("close",function()
        {
            //sort depths
            depths.sort(function(a : PositionsWithDepths,b : PositionsWithDepths)
            {
                return a.depth - b.depth;
            });

            /*
                Instead of rendering one marker for every single position, we stretch a single marker to cover sequential positions which are all at the same
                depth.
            */
            for(let i = 0; i != depths.length; ++i)
            {
                //sort positions within each depth position we're looking at
                depths[i].positions.sort(function(a : number,b : number)
                {
                    return a - b;
                });
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
            
                res += "</plasmidtrack>";
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
) : Promise<void>
{
    return new Promise<void>(async (resolve,reject) => 
    {
        try
        {
            mkdirp.sync(getReadableAndWritable(`rt/circularFigures/${figure.uuid}/coverage/${align.uuid}/${contiguuid}`));
        }
        catch(err)
        {}
    
        let coverageTracks = await buildCoverageTrackTemplate(figure,contiguuid,align,colour,scaleFactor);
        let trackRecord = new RenderedCoverageTrackRecord(align.uuid,contiguuid,figure.uuid,colour,scaleFactor);
        fs.writeFileSync(getCachedCoverageTrackTemplatePath(trackRecord),coverageTracks);
        figure.renderedCoverageTracks.push(trackRecord);
        resolve();
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
export function cacheCoverageTrackSVG(trackRecord : RenderedCoverageTrackRecord,svg : string) : void
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
 * @param {Plasmid} plasmid 
 */
export function cacheCoverageTrackPB(trackRecord : RenderedCoverageTrackRecord,plasmid : Plasmid) : void
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
    return new Promise<string>((resolve,reject) => 
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
        SNPPositions.sort(function(a : SNPPosition,b : SNPPosition)
        {
            return a.position - b.position;
        });

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
    return new Promise<string>(async (resolve,reject) => 
    {
        try
        {
            mkdirp.sync(getReadableAndWritable(`rt/circularFigures/${figure.uuid}/snp/${align.uuid}/${contiguuid}`));
        }
        catch(err)
        {}
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

export function buildCoverageTrackMap(trackRecord : RenderedCoverageTrackRecord,figure : CircularFigure) : Promise<CoverageTrackMap>
{

    return new Promise<CoverageTrackMap>(async (resolve,reject) => 
    {

        let map : CoverageTrackMap = new CoverageTrackMap();
        map.$scope = makeMapScope(figure);

        //try to build from protocol buffer
        if(fs.existsSync(getCoverageTrackPBPath(trackRecord)))
        {
            map.fromNode<any>(
                pbDirectives.Node.decode(
                    fs.readFileSync(
                        getCoverageTrackPBPath(trackRecord)
                    )
                )
            );
            resolve(map);
        }

        //first time for this coverage track
        else
        {
            let nodes : Array<html.Node> = await html.loadFromString(
                assembleCompilableCoverageTrack(figure,trackRecord)
            );

            for(let i = 0; i != nodes.length; ++i)
            {
                if(nodes[i].name == "div")
                {
                    for(let k = 0; k != nodes[i].children.length; ++k)
                    {
                        if(nodes[i].children[k].name == "plasmid")
                        {
                            map.fromNode<html.Node>(nodes[i].children[k]);
                            break;
                        }
                    }
                    break;
                }
            }

            //write optimized protocol buffer version for future use
            cacheCoverageTrackPB(trackRecord,map);

            resolve(map);
        }
    });
}

export function buildSNPTrackMap(trackRecord : RenderedSNPTrackRecord,figure : CircularFigure) : Promise<SNPTrackMap>
{

    return new Promise<SNPTrackMap>(async (resolve,reject) => 
    {

        let nodes : Array<html.Node> = await html.loadFromString(
            assembleCompilableSNPTrack(figure,trackRecord)
        );

        let map : SNPTrackMap = new SNPTrackMap();
        map.$scope = makeMapScope(figure);

        for(let i = 0; i != nodes.length; ++i)
        {
            if(nodes[i].name == "div")
            {
                for(let k = 0; k != nodes[i].children.length; ++k)
                {
                    if(nodes[i].children[k].name == "plasmid")
                    {
                        map.fromNode<html.Node>(nodes[i].children[k]);
                        break;
                    }
                }
                break;
            }
        }

        resolve(map);
    });
}

/**
 * Compiles templates to SVG using $scope. 
 * 
 * @export
 * @param {string} templates 
 * @param {MapScope} $scope 
 * @returns {Promise<string>} 
 */
export function compileTemplatesToSVG(templates : string,$scope : MapScope) : Promise<string>
{
    return new Promise<string>(async (resolve,reject) => 
    {
        let nodes : Array<html.Node> = await html.loadFromString(templates);

        let plasmid : Plasmid = new Plasmid();
        plasmid.$scope = $scope;

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

/**
 * Compiles a single SVG for figure consisting of its baseFigure and all its selected tracks
 * 
 * @export
 * @param {CircularFigure} figure 
 * @returns {Promise<string>} 
 */
export function buildSingleSVG(figure : CircularFigure) : Promise<string>
{
    return new Promise<string>(async (resolve,reject) => 
    {
        let template = "";
        
        for(let i = 0; i != figure.renderedCoverageTracks.length; ++i)
        {
            if(figure.renderedCoverageTracks[i].checked)
            {
                template += fs.readFileSync(getCachedCoverageTrackTemplatePath(figure.renderedCoverageTracks[i])).toString();
            }
        }

        for(let i = 0; i != figure.renderedSNPTracks.length; ++i)
        {
            if(figure.renderedSNPTracks[i].checked)
            {
                template += fs.readFileSync(getCachedSNPTrackTemplatePath(figure.renderedSNPTracks[i])).toString();
            }
        }

        template += getBaseFigureTemplateFromCache(figure);

        let nodes : Array<html.Node> = await html.loadFromString(assembleCompilableTemplates(figure,template));
        let plasmid : Plasmid = new Plasmid();
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
 * Renders the given svg using the given canvas rendering context
 * 
 * @export
 * @param {string} svg 
 * @param {CanvasRenderingContext2D} ctx 
 * @returns {Promise<void>} 
 */
export function renderSVGToCanvas(svg : string, ctx : CanvasRenderingContext2D) : Promise<void>
{
    return new Promise<void>((resolve,reject) => 
    {
        let img : HTMLImageElement = new Image();
        let url : string = window.URL.createObjectURL(
            new Blob(
                [svg],
                <BlobPropertyBag>{
                    type : "image/svg+xml"
                }
            )
        );
        img.onload = function()
        {
            ctx.drawImage(img,0,0);
            window.URL.revokeObjectURL(url);
            resolve();
        };
        img.src = url;
    });
}

/**
 * Renders the given coverage track using the given figure and canvas rendering context
 * 
 * @export
 * @param {CoverageTrackMap} map 
 * @param {CircularFigure} figure 
 * @param {CanvasRenderingContext2D} ctx 
 */
export function renderCoverageTrackToCanvas(
    map : CoverageTrackMap,
    figure : CircularFigure,
    ctx : CanvasRenderingContext2D
) : void 
{
    //We assume a lot of things about coverage tracks in this method to save time
    //If coverage tracks change at some point in the future, this will have to be updated
    //We assume coverage tracks are made of <plasmidtrack>s and <trackmarker>s only
    
    map.$scope = makeMapScope(figure);
    map.interpolateAttributes();

    //Assume linewidth is constant and uniform
    ctx.lineWidth = 0.1;
    
    //Assume fill is constant and uniform
    ctx.strokeStyle = parseCSS(
        (<TrackMarker>map.tracks[0].children[0]).markerstyle,
        "fill",
        ";"
    );
    for(let i = 0; i != map.tracks.length; ++i)
    {
        map.tracks[i].interpolateAttributes();
        let path = new Path2D();

        for(let k = 0; k != map.tracks[i].children.length; ++k)
        {
            map.tracks[i].children[k].interpolateAttributes();

            let d = map.tracks[i].children[k].generateSVGPathNumeric();

            path.moveTo(d[1],d[2]);
            path.lineTo(d[12],d[13]);
            path.lineTo(d[15],d[16]);
            path.lineTo(d[18],d[19]);
            path.lineTo(d[21],d[22]);
            path.lineTo(d[32],d[33]);
            path.lineTo(d[35],d[36]);
            path.lineTo(d[38],d[39]);
            path.lineTo(d[41],d[42]);
        }

        ctx.stroke(path);
    }
}

export function renderSNPTrackToCanvas(
    map : SNPTrackMap,
    figure : CircularFigure,
    ctx : CanvasRenderingContext2D
) : Promise<void> 
{
    return new Promise<void>(async (resolve,reject) => 
    {
        map.$scope = makeMapScope(figure);

        await renderSVGToCanvas(map.renderStart()+map.renderEnd(),ctx);
        resolve();
    });
}