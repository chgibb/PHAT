const jsonFile = require("jsonfile");
const uuidv4 : () => string = require("uuid/v4");

import {getReadableAndWritable} from "./getAppPath";
import {ProjectManifest,getProjectManifests} from "./projectManifest";

export function newProject(name : string) : Promise<{}>
{
    return new Promise((resolve,reject) => {
        let projects : Array<ProjectManifest>;
        try
        {
             projects = jsonFile.readFileSync(getProjectManifests());
        }
        catch(err)
        {
            projects = new Array<ProjectManifest>();
        }
        let uuid : string = uuidv4();
        projects.push({
            alias : name,
            lastOpened : Date.now(),
            created : Date.now(),
            uuid : uuid
        });
        jsonFile.writeFileSync(getProjectManifests(),projects,{spaces : 4});
        resolve();
    });
}