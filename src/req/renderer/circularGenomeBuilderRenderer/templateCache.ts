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
    public svg : string;
    public constructor(trackRecord : cf.RenderedCoverageTrackRecord)
    {
        this.trackRecord = trackRecord;
        this.svg = cf.getCoverageTrackSVGFromCache(trackRecord);
    }
}

class CachedSNPTrackSVG
{
    public trackRecord : cf.RenderedSNPTrackRecord;
    public svg : string;
    public constructor(trackRecord : cf.RenderedSNPTrackRecord)
    {
        this.trackRecord = trackRecord;
        this.svg = cf.getSNPTrackSVGFromCache(trackRecord);
    }
}

export let baseFigureSVG : string = undefined;

let coverageTrackCache = new Array<CachedCoverageTrackSVG>();;
let SNPTrackCache = new Array<CachedSNPTrackSVG>();

export function resetBaseFigureSVG() : void
{
    baseFigureSVG = undefined;
}

export function resetCaches() : void
{
    coverageTrackCache = new Array<CachedCoverageTrackSVG>();
    SNPTrackCache = new Array<CachedSNPTrackSVG>();
    baseFigureSVG = undefined
}

export function refreshCache(newFigure : cf.CircularFigure) : void
{
    if(!figure || newFigure.uuid != figure.uuid)
    {
        resetCaches();
        figure = newFigure;
    }
    console.log(newFigure);
    if(!newFigure.isInteractive)
    {
        if(!baseFigureSVG)
        {
            try
            {
                baseFigureSVG = cf.getBaseFigureSVGFromCache(figure);
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
            }
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
            }
        }
    }

    found = false;
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
            return coverageTrackCache[i].svg;
    }
    throw new Error(`Could not fetch ${trackRecord.uuid} from cache`);
}

export function getCachedSNPTrack(trackRecord : cf.RenderedSNPTrackRecord) : string
{
    for(let i = 0; i != SNPTrackCache.length; ++i)
    {
        if(SNPTrackCache[i].trackRecord.uuid == trackRecord.uuid)
            return SNPTrackCache[i].svg;
    }
    throw new Error(`Could not fetch ${trackRecord.uuid} from cache`);
}

export function removeTrack(uuid : string) : void
{
    for(let i = 0; i != coverageTrackCache.length; ++i)
    {
        if(coverageTrackCache[i].trackRecord.uuid == uuid)
        {
            coverageTrackCache.splice(i,1);
            console.log("removed "+uuid);
            return;
        }
    }
    for(let i = 0; i != SNPTrackCache.length; ++i)
    {
        if(SNPTrackCache[i].trackRecord.uuid == uuid)
        {
            SNPTrackCache.splice(i,1);
            console.log("removed "+uuid);
            return;
        }
    }
}

export function triggerReCompileForWholeFigure(newFigure : cf.CircularFigure) : void
{
    if(!figure)
        return;
    if(!figure.isInteractive)
    {
        ipc.send(
            "runOperation",
            <AtomicOperationIPC>{
                opName : "compileTemplates",
                figure : newFigure,
                compileBase : true
            }
        );
    }
    for(let i = 0; i != coverageTrackCache.length; ++i)
    {
        ipc.send(
            "runOperation",
            <AtomicOperationIPC>{
                opName : "compileTemplates",
                figure : newFigure,
                compileBase : false,
                uuid : coverageTrackCache[i].trackRecord.uuid
            }
        );
    }
    for(let i = 0; i != SNPTrackCache.length; ++i)
    {
        ipc.send(
            "runOperation",
            <AtomicOperationIPC>{
                opName : "compileTemplates",
                figure : newFigure,
                compileBase : false,
                uuid : SNPTrackCache[i].trackRecord.uuid
            }
        );
    }
}