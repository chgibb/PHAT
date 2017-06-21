import * as path from "path";

import {getReadableAndWritable} from "./getAppPath";

export interface ProjectManifest
{
    alias : string;
    lastOpened : number;
    created : number;
    uuid : string;
    isExternal : boolean;
    externalPath : string;
}

export function getProjectManifests() : string
{
    return getReadableAndWritable("projectManifests.json");
}
export function getTarBallPath(proj : ProjectManifest)
{
    if(!proj.isExternal)
    {
        return getReadableAndWritable(`projects/${proj.uuid}`);
    }
    else
        return path.resolve(proj.externalPath);
}