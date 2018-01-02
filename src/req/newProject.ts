import {ProjectManifest,getProjectManifests} from "./projectManifest";

/**
 * Creates a new project in the project manifest with name name
 * 
 * @export
 * @param {string} name 
 * @returns {Promise<void>} 
 */
export function newProject(name : string) : Promise<void>
{
    const jsonFile = require("jsonfile");
    const uuidv4 : () => string = require("uuid/v4");
    
    return new Promise<void>((resolve,reject) => {
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
            uuid : uuid,
            isExternal : false,
            externalPath : ""
        });
        jsonFile.writeFileSync(getProjectManifests(),projects,{spaces : 4});
        resolve();
    });
}