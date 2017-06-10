import * as fs from "fs";
import * as path from "path";

let editionString : string = undefined;
//Assume not testing/CI
let editionSource = path.dirname(process.execPath)+"/edition";

function getEditionString()
{
    if(!editionString)
    {
        try
        {
            editionString = (<any>fs.readFileSync(editionSource));
        }
        catch(err)
        {
            editionSource = process.cwd()+"/edition";
            editionString = (<any>fs.readFileSync(editionSource));
        }
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
