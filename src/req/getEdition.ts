import * as fs from "fs";
import * as path from "path";

let editionString : string = undefined;

/*
    reimplementation of algorithm in getAppPath.ts
    this is done in order to prevent a recursive dependence.
*/
function getEditionSource() : string
{
    let electronBaseDir = "";
    let electronEditionFile = "";

    let CIBaseDir = "";
    let CIEditionFile = "";

    let InstalledBaseDir = "";
    let InstalledEditionFile = "";

    electronBaseDir = path.dirname(process.execPath)+"/resources/app/";

    electronEditionFile = path.resolve(path.normalize(electronBaseDir+"edition.txt"));

    CIBaseDir = process.cwd()+"/resources/app/";
    CIEditionFile = path.resolve(path.normalize(CIBaseDir+"edition.txt"));

    InstalledBaseDir = electronBaseDir;
    InstalledEditionFile = electronEditionFile;


    if(fs.existsSync(electronEditionFile))
        return electronEditionFile;
    if(fs.existsSync(CIEditionFile))
        return CIEditionFile;
    
    throw new Error("Could not determine edition file path");
} 

function getEditionString()
{
    if(!editionString)
    {
        editionString = (<any>fs.readFileSync(getEditionSource()).toString());
    }
}

export function getEdition() : string
{
    getEditionString();
    return editionString;
}
