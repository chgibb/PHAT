import * as fs from "fs";

import * as electron from "electron";
const ipc = electron.ipcRenderer;

import {AtomicOperationIPC} from "./../../atomicOperationsIPC";
import * as cf from "./../circularFigure";

let figure : cf.CircularFigure;

export abstract class SVGCache
{
    public isDirty : boolean;
    public svg : string;
    public uuid : string
    public buildingSVG : boolean;
    public constructor()
    {
        this.isDirty = true;
        this.buildingSVG = false;
        this.svg = "";
        this.uuid = "";
    }
    public abstract clean() : boolean;
    public makeDirty() : void
    {
        this.svg = "";
        this.isDirty = true;
    }
}

export class CoverageTrackSVGCache extends SVGCache
{
    public trackRecord : cf.RenderedCoverageTrackRecord;
    public constructor(trackRecord : cf.RenderedCoverageTrackRecord)
    {
        super();
        this.trackRecord = trackRecord;
    }
    public clean() : boolean
    {
        if(!this.isDirty || this.svg)
        {
            this.isDirty = false;
            return true;
        }
        try
        {
            this.svg = cf.getCoverageTrackSVGFromCache(this.trackRecord);
            this.isDirty = false;
            return true;
        }
        catch(err)
        {
            this.isDirty = true;
            return false;
        }
    }
}

export class BaseFigureSVGCache extends SVGCache
{
    public constructor()
    {
        super();
    }
    public clean() : boolean
    {
        if(!this.isDirty || this.svg)
        {
            this.isDirty = false;
            return true;
        }
        try
        {
            this.svg = cf.getBaseFigureSVGFromCache(figure);
            this.isDirty = false;
            return true;
        }
        catch(err)
        {
            this.isDirty = true;
            return false;
        }

    }
}
export let baseFigureSVGCache = new BaseFigureSVGCache();
export let coverageTrackSVGCache = new Array<CoverageTrackSVGCache>();

export function resetCaches()
{
    baseFigureSVGCache = new BaseFigureSVGCache();
    coverageTrackSVGCache = new Array<CoverageTrackSVGCache>();
}

export let cachesWereReset = false;
export function refreshCache(newFigure : cf.CircularFigure) : void
{
    cachesWereReset = false;
    if(!figure || newFigure.uuid != figure.uuid)
    {
        resetCaches();
        figure = newFigure;
        cachesWereReset = true;
        console.log("caches were reset");
    }

    let found = false;
    for(let i = 0; i != newFigure.renderedCoverageTracks.length; ++i)
    {
        found = false;
        for(let k = 0; k != coverageTrackSVGCache.length; ++k)
        {
            if(newFigure.renderedCoverageTracks[i].uuid == coverageTrackSVGCache[k].trackRecord.uuid)
            {
                found = true;
                break;
            }
        }
        if(!found)
        {
            coverageTrackSVGCache.push(new CoverageTrackSVGCache(newFigure.renderedCoverageTracks[i]));
        }
    }
}