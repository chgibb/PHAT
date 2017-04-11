import * as path from "path";
const uuidv1 : () => string = require("uuid/v1");
export class File
{
    public path : string;
    public absPath : string;
    public uuid : string;
    public reachable : boolean;
    public constructor()
    {
        this.path = "";
        this.absPath = "";
        this.uuid = "";
        this.reachable = false;
    }
}
export function setabsPath(file : File) : string
{
    file.absPath = path.resolve(file.path);
    return file.absPath;
}
export function setUUID(file : File) : string
{
    file.uuid = uuidv1();
    return file.uuid;
}