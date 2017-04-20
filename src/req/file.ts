import * as fs from "fs";
import * as Path from "path";
const uuidv1 : () => string = require("uuid/v1");

import formatByteString from "./renderer/formatByteString";
export class File
{
    public path : string;
    public absPath : string;
    public uuid : string;
    public reachable : boolean;
    public size : number;
    public sizeString : string;
    public constructor(path : string)
    {
        this.path = path;
        this.absPath = Path.resolve(path);
        this.uuid = uuidv1();
        this.reachable = true;
        let stats : fs.Stats = fs.statSync(path);
        this.size = stats.size;
        this.sizeString = formatByteString(this.size);
    }
}
