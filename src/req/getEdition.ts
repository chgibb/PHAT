import * as fs from "fs";

let editionString = "";
let editionSource = "edition"

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
