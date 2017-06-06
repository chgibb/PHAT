const jsonFile = require("jsonfile");
const uuidv4 : () => string = require("uuid/v4");

import {ProjectManifest,manifestsPath} from "./projectManifest";

export function newProject(name : string) : Promise<{}>
{
    return new Promise((resolve,reject) => {
        let projects : Array<ProjectManifest>;
        try
        {
             projects = jsonFile.readFileSync(manifestsPath);
        }
        catch(err)
        {
            projects = new Array<ProjectManifest>();
        }
        let uuid : string = uuidv4();
        projects.push({
            alias : name,
            tarBall : `resources/app/projects/${uuid}.phat`,
            lastOpened : Date.now().toString(),
            created : Date.now().toString(),
            uuid : uuid
        });
        jsonFile.writeFileSync(manifestsPath,projects,{spaces : 4});
        resolve();
    });
}