import * as fs from "fs";
import * as path from "path";

import {getReadable} from "./getAppPath";
let editionString : string = undefined;
//Assume not testing/CI
//let editionSource = path.dirname(process.execPath)+"/edition";
let editionSource = getReadable("edition.txt");

function getEditionString()
{
    if(!editionString)
    {
        editionString = (<any>fs.readFileSync(editionSource));
    }
}

export function setEditionSource(path : string)
{
    editionSource = path;
}

export function getEdition() : string
{
    getEditionString();
    return editionString;
}
