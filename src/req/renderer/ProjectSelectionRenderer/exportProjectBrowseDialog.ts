import * as fse from "fs-extra";
import * as electron from "electron";
const dialog = electron.remote.dialog;

const jsonFile = require("jsonfile");

import * as viewMgr from "./../viewMgr";
import {ProjectManifest,getTarBallPath,getProjectManifests} from "./../../projectManifest";

export function exportProjectBrowseDialog(proj : ProjectManifest) : Promise<undefined>
{
    return new Promise((resolve,reject) => {
        dialog.showSaveDialog(
            {
                filters : [
                    {
                        name : "PHAT Project",
                        extensions : ["phat"]
                    }
                ]
            },
            function(fileName : string)
            {
                if(fileName === undefined)
                    return resolve();
            
                fse.copy(
                    getTarBallPath(proj),fileName,(err : Error) => {
                        if(err)
                            reject(err);
                        else
                        {
                            let projects : Array<ProjectManifest>;
                            projects = jsonFile.readFileSync(getProjectManifests());
                            for(let i = 0; i != projects.length; ++i)
                            {
                                if(proj.uuid == projects[i].uuid)
                                {
                                    new Promise<void>((resolve,reject) => {
                                        fse.remove(getTarBallPath(projects[i]),(err : Error) => {
                                            if(err)
                                            {
                                                alert(`Failed to remove original project`);
                                                reject();
                                            }
                                            else
                                            {
                                                projects.splice(i,1);
                                                jsonFile.writeFileSync(getProjectManifests(),projects);
                                                resolve();
                                            }
                                        });
                                    }).then(() => {
                                        viewMgr.changeView("splashView");
                                        viewMgr.render();
                                        resolve();
                                    });
                                    break;
                                }
                            }
                        }
                    }
                );
            }
        );
    });
}