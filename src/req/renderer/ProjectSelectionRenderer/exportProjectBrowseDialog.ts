import * as fse from "fs-extra";

import * as electron from "electron";
const dialog = electron.remote.dialog;

import {ProjectManifest,getTarBallPath} from "./../../projectManifest";

export function exportProjectBrowseDialog(proj : ProjectManifest) : void
{
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
                return;
            
            fse.copy(
                getTarBallPath(proj),fileName,(err : Error) => {
                    if(err)
                        throw err;
                    else
                        alert("Finished exporting "+proj.alias);
                }
            );
        }
    );
}