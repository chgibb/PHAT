import * as fs from "fs";
import * as path from "path";

const uuidv4 : () => string = require("uuid/v4");
import * as fse from "fs-extra";

import {getReadableAndWritable} from "./getAppPath";
import trimPath from "./trimPath";
import formatByteString from "./renderer/formatByteString";
export class File
{
    public alias : string
    public path : string;
    public imported : boolean;
    public uuid : string;
    public reachable : boolean;
    public size : number;
    public sizeString : string;
    public constructor(path : string)
    {
        this.path = path;
        this.alias = trimPath(path);
        this.uuid = uuidv4();
        this.reachable = true;
        let stats : fs.Stats = fs.statSync(path);
        this.size = stats.size;
        this.sizeString = formatByteString(this.size);
        this.imported = false;
    }
}

export function importIntoProject(file : File) : void
{
    if(file.imported)
        return;

    fs.mkdirSync(getReadableAndWritable(`rt/imported/${file.uuid}`));
    fse.copySync(getPath(file),getReadableAndWritable(`rt/imported/${file.uuid}/${file.alias}`));
    file.path = `rt/imported/${file.uuid}/${file.alias}`;
    file.imported = true;
    
}

export function getPath(file : File) : string
{
    if(!file.imported)
    {
        return path.resolve(file.path);
    }
    else
    {
        return getReadableAndWritable(file.path);
    }

}