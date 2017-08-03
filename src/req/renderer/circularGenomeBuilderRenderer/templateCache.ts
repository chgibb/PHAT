import * as fs from "fs";

import * as electron from "electron";
const ipc = electron.ipcRenderer;

import {AtomicOperationIPC} from "./../../atomicOperationsIPC";
import * as cf from "./../circularFigure";

/*
    This module acts as a wrapper over circularFigure's track record functionality.
    It provides an in memory cache of track SVGs, instead of using circularFigure's disk based
    access.
*/

let figure : cf.CircularFigure;

class CachedCoverageTrackSVG
{
    public trackRecord : cf.RenderedCoverageTrackRecord;
    public SVGString : string;
    public constructor(trackRecord : cf.RenderedCoverageTrackRecord)
    {
        this.trackRecord = trackRecord;
        this.SVGString = cf.getCoverageTrackSVGFromCache(trackRecord);
    }
}

class CachedSNPTrackSVG
{
    public trackRecord : cf.RenderedSNPTrackRecord;
    public SVGString : string;
    public constructor(trackRecord : cf.RenderedSNPTrackRecord)
    {
        this.trackRecord = trackRecord;
        this.SVGString = cf.getSNPTrackSVGFromCache(trackRecord);
    }
}

let baseFigureSVGString = "";

let coverageTrackCache = new Array<CachedCoverageTrackSVG>();;
let SNPTrackCache = new Array<CachedSNPTrackSVG>();
export let baseFigureCache : string;

export let cachesWereReset : boolean = false;
export let startedNewSVG : boolean = false;
export let pendingSVGs = 0;

export function resetCaches() : void
{
    coverageTrackCache = new Array<CachedCoverageTrackSVG>();
    SNPTrackCache = new Array<CachedSNPTrackSVG>();
    resetBaseFigureCache();
}

export function resetBaseFigureCache() : void
{
    baseFigureCache = undefined;
}

export function refreshCache(newFigure : cf.CircularFigure) : void
{
    cachesWereReset = false;
    startedNewSVG = false;
    pendingSVGs = 0;
    if(!figure || newFigure.uuid != figure.uuid)
    {
        resetCaches();
        cachesWereReset = true;
        figure = newFigure;
        baseFigureCache = undefined;
    }

    if(!baseFigureCache)
    {
        try
        {
            baseFigureCache = cf.getBaseFigureSVGFromCache(newFigure);
            cachesWereReset = true;
            startedNewSVG = true;
        }
        catch(err)
        {
            ipc.send(
                "runOperation",
                <AtomicOperationIPC>{
                    opName : "compileTemplates",
                    figure : newFigure,
                    compileBase : true
                }
            );
            startedNewSVG = true;
            pendingSVGs++;
        }
    }
    //load tracks which had not been loaded previously
    let found = false;
    for(let i = 0; i != newFigure.renderedCoverageTracks.length; ++i)
    {
        found = false;
        for(let k = 0; k != coverageTrackCache.length; ++k)
        {
            if(newFigure.renderedCoverageTracks[i].uuid == coverageTrackCache[k].trackRecord.uuid)
            {
                found = true;
                break;
            }
        }
        if(!found)
        {
            try
            {
                coverageTrackCache.push(new CachedCoverageTrackSVG(newFigure.renderedCoverageTracks[i]));
            }
            catch(err)
            {
                ipc.send(
                    "runOperation",
                    <AtomicOperationIPC>{
                        opName : "compileTemplates",
                        figure : newFigure,
                        uuid : newFigure.renderedCoverageTracks[i].uuid,
                        compileBase : false
                    }
                );
                startedNewSVG = true;
                pendingSVGs++;
            }
        }
    }

    for(let i = 0; i != newFigure.renderedSNPTracks.length; ++i)
    {
        found = false;
        for(let k = 0; k != SNPTrackCache.length; ++k)
        {
            if(newFigure.renderedSNPTracks[i].uuid == SNPTrackCache[k].trackRecord.uuid)
            {
                found = true;
                break;
            }
        }
        if(!found)
        {
            try
            {
                SNPTrackCache.push(new CachedSNPTrackSVG(newFigure.renderedSNPTracks[i]));
            }
            catch(err)
            {
                ipc.send(
                    "runOperation",
                    <AtomicOperationIPC>{
                        opName : "compileTemplates",
                        figure : newFigure,
                        uuid : newFigure.renderedSNPTracks[i].uuid,
                        compileBase : false
                    }
                );
                startedNewSVG = true;
                pendingSVGs++;
            }
        }
    }
}

//retrieve loaded tracks
export function getCachedCoverageTrack(trackRecord : cf.RenderedCoverageTrackRecord) : string
{
    for(let i = 0; i != coverageTrackCache.length; ++i)
    {
        if(coverageTrackCache[i].trackRecord.uuid == trackRecord.uuid)
            return coverageTrackCache[i].SVGString;
    }
    throw new Error(`Could not fetch ${trackRecord.uuid} from cache`);
}

export function getCachedSNPTrack(trackRecord : cf.RenderedSNPTrackRecord) : string
{
    for(let i = 0; i != SNPTrackCache.length; ++i)
    {
        if(SNPTrackCache[i].trackRecord.uuid == trackRecord.uuid)
            return SNPTrackCache[i].SVGString;
    }
    throw new Error(`Could not fetch ${trackRecord.uuid} from cache`);
}