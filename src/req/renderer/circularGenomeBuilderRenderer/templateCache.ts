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

/**
 * Compile and overwrite disk cache for track
 * 
 * @export
 * @param {cf.RenderedCoverageTrackRecord} track 
 * @param {cf.CircularFigure} figure 
 * @returns {Promise<string>} 
 */
export function compileCoverageTrack(track : cf.RenderedCoverageTrackRecord,figure : cf.CircularFigure) : Promise<string>
{
    return new Promise<string>(async (resolve,reject) => {
        let svg = await cf.compileCoverageTrackSVG(track,figure);
        cf.cachCoverageTrackSVG(track,svg);
        resolve(svg);
    });
}

/**
 * Clear the in-memory cache of the SVG for the base figure
 * 
 * @export
 */
export function resetBaseFigureSVG() : void
{
    baseFigureSVG = undefined;
}

/**
 * Clear all in-memory caches
 * 
 * @export
 */
export function resetCaches() : void
{
    coverageTrackCache = new Array<CachedCoverageTrackSVG>();
    SNPTrackCache = new Array<CachedSNPTrackSVG>();
    baseFigureSVG = undefined
}

/**
 * Reset just the base figure cache
 * 
 * @export
 */
export function resetBaseFigureCache() : void
{
    baseFigureSVG = undefined;
}

/**
 * Update caches for newFigure with new data (if changes are detected).
 * Will reset and rebuild caches if this function is called with a figure
 * different from the one used the last time it was called
 * 
 * @export
 * @param {cf.CircularFigure} newFigure 
 */
export async function refreshCache(newFigure : cf.CircularFigure)
{
    if(!figure || newFigure.uuid != figure.uuid)
    {
        resetCaches();
        figure = newFigure;
    }
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
                await compileCoverageTrack(newFigure.renderedCoverageTracks[i],newFigure);
                coverageTrackCache.push(new CachedCoverageTrackSVG(newFigure.renderedCoverageTracks[i]));
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


/**
 * Retrieve an (already loaded) SVG for the specified coverage track
 * 
 * @export
 * @param {cf.RenderedCoverageTrackRecord} trackRecord 
 * @returns {string} 
 */
export function getCachedCoverageTrack(trackRecord : cf.RenderedCoverageTrackRecord) : string
{
    for(let i = 0; i != coverageTrackCache.length; ++i)
    {
        if(coverageTrackCache[i].trackRecord.uuid == trackRecord.uuid)
            return coverageTrackCache[i].svg;
    }
    throw new Error(`Could not fetch ${trackRecord.uuid} from cache`);
}

/**
 * Retrieve an (already loaded) SVG for the specified SNP track
 * 
 * @export
 * @param {cf.RenderedSNPTrackRecord} trackRecord 
 * @returns {string} 
 */
export function getCachedSNPTrack(trackRecord : cf.RenderedSNPTrackRecord) : string
{
    for(let i = 0; i != SNPTrackCache.length; ++i)
    {
        if(SNPTrackCache[i].trackRecord.uuid == trackRecord.uuid)
            return SNPTrackCache[i].svg;
    }
    throw new Error(`Could not fetch ${trackRecord.uuid} from cache`);
}

/**
 * Deletes the track specified by uuid from the in-memory cache
 * 
 * @export
 * @param {string} uuid 
 * @returns {void} 
 */
export function removeTrack(uuid : string) : void
{
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


/**
 * Triggers a compile for each compononent of newFigure (including non-visible data tracks) regardless of cache status.
 * Will only trigger a compile for the base figure if the figure is non-interactive
 * 
 * @export
 * @param {cf.CircularFigure} newFigure 
 * @returns 
 */
export async function triggerReCompileForWholeFigure(newFigure : cf.CircularFigure)
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
        coverageTrackCache[i].svg = await compileCoverageTrack(coverageTrackCache[i].trackRecord,newFigure);
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