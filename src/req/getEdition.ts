import * as fs from "fs";

let editionString : string = undefined;
let editionSource = process.cwd()+"/edition";

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
