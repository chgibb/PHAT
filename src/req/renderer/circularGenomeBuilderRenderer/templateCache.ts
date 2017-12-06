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

class CoverageTrackMap
{
    public trackRecord : cf.RenderedCoverageTrackRecord;
    public map : cf.CoverageTrackMap;
    public async build(trackRecord : cf.RenderedCoverageTrackRecord,figure : cf.CircularFigure)
    {
        this.trackRecord = trackRecord;
        this.map = await cf.buildCoverageTrackMap(trackRecord,figure);
    }
}

class SNPTrackMap
{
    public trackRecord : cf.RenderedSNPTrackRecord;
    public map : cf.SNPTrackMap;
    public async build(trackRecord : cf.RenderedSNPTrackRecord,figure : cf.CircularFigure)
    {
        this.trackRecord = trackRecord;
        this.map = await cf.buildSNPTrackMap(trackRecord,figure);
    }
}

export let baseFigureSVG : string = undefined;

let coverageTrackMaps = new Array<CoverageTrackMap>();
let SNPTrackMaps = new Array<SNPTrackMap>();

/**
 * Compile and overwrite disk cache for figure's base figure SVG
 * 
 * @export
 * @param {cf.CircularFigure} figure 
 * @returns {Promise<string>} 
 */
export function compileBaseFigure(figure : cf.CircularFigure) : Promise<string>
{
    return new Promise<string>(async (resolve,reject) => {
        let svg = await cf.compileBaseFigureSVG(figure);
        cf.cacheBaseFigureSVG(figure,svg);
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
    coverageTrackMaps = new Array<CoverageTrackMap>();
    SNPTrackMaps = new Array<SNPTrackMap>();
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
    //if we're switching to a different figure, blow up everything
    if(!figure || newFigure.uuid != figure.uuid)
    {
        resetCaches();
        figure = newFigure;
    }

    //it's the same figure, update to reflect changes when maps are compiled
    else
        figure = newFigure;
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
                baseFigureSVG = await compileBaseFigure(figure);
            }
        }
    }

    //load tracks which had not been loaded previously
    let found = false;
    for(let i = 0; i != newFigure.renderedCoverageTracks.length; ++i)
    {
        found = false;
        for(let k = 0; k != coverageTrackMaps.length; ++k)
        {
            if(newFigure.renderedCoverageTracks[i].uuid == coverageTrackMaps[k].trackRecord.uuid)
            {
                found = true;
                break;
            }
        }
        if(!found)
        {
            let map : CoverageTrackMap = new CoverageTrackMap();
            await map.build(newFigure.renderedCoverageTracks[i],figure);
            coverageTrackMaps.push(map);
        }
    }

    found = false;
    for(let i = 0; i != newFigure.renderedSNPTracks.length; ++i)
    {
        found = false;
        for(let k = 0; k != SNPTrackMaps.length; ++k)
        {
            if(newFigure.renderedSNPTracks[i].uuid == SNPTrackMaps[k].trackRecord.uuid)
            {
                found = true;
                break;
            }
        }
        if(!found)
        {
            let map : SNPTrackMap = new SNPTrackMap();
            await map.build(newFigure.renderedSNPTracks[i],figure);
            SNPTrackMaps.push(map);
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
export function getCoverageTrackSVG(trackRecord : cf.RenderedCoverageTrackRecord) : string
{
    for(let i = 0; i != coverageTrackMaps.length; ++i)
    {
        if(coverageTrackMaps[i].trackRecord.uuid == trackRecord.uuid)
        {
            coverageTrackMaps[i].map.$scope = {genome : figure};
            return coverageTrackMaps[i].map.renderStart()+coverageTrackMaps[i].map.renderEnd();
        }
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
export function getSNPTrackSVG(trackRecord : cf.RenderedSNPTrackRecord) : string
{
    for(let i = 0; i != SNPTrackMaps.length; ++i)
    {
        if(SNPTrackMaps[i].trackRecord.uuid == trackRecord.uuid)
        {
            SNPTrackMaps[i].map.$scope = {genome : figure}
            return SNPTrackMaps[i].map.renderStart()+SNPTrackMaps[i].map.renderEnd();
        }
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
    
}
