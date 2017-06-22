import * as fs from "fs";
import * as path from "path";

let editionString : string = undefined;

/*
    reimplementation of algorithm in getAppPath.ts
    this is done in order to prevent a recursive dependence.
*/
function getEditionSource() : string
{
    let baseDir = "";
    if(process.versions["electron"])
        baseDir = path.dirname(process.execPath)+"/resources/app";
    else
        baseDir = process.cwd()+"/resources/app";
    return path.resolve(path.normalize(baseDir+"/edition.txt"))
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
