import {getReadableAndWritable} from "./getAppPath";

export interface ProjectManifest
{
    alias : string;
    lastOpened : number;
    created : number;
    uuid : string;
}

export function getProjectManifests() : string
{
    return getReadableAndWritable("projectManifests.json");
}