import {makeValidID} from "./MakeValidID";
import {trimPath} from "./trimPath";
export default class Fastq
{
    public name : string;
    public alias : string;
    public size : number;
    public sizeString : string;
    public sequences : number;
    public validID : string;
    public checked : boolean;
    public constructor(name : string)
    {
        this.name = name;
        this.alias = trimPath(name);
        this.size = 0;
        this.sizeString = "0";
        this.sequences = 0;
        this.validID = makeValidID(name);
        this.checked = false;
    }
}