const jsonFile = require("jsonfile");

import {getReadableAndWritable} from "./../../getAppPath";
import {ProjectManifest} from "./../../projectManifest";
export function getCurrentlyOpenProject() : ProjectManifest | undefined
{
    let rt : any;
    try
    {
        rt = jsonFile.readFileSync(getReadableAndWritable(`rt/rt.json`));
        return rt.application.project;
    }
    catch(err)
    {
        return undefined;
    }
}