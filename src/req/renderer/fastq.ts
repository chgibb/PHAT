import {File,setUUID,setabsPath} from "./../file";
import {QCData,QCSummary} from "./QCData";
import {makeValidID} from "./MakeValidID";
import trimPath from "./trimPath";
export default class Fastq extends File
{
    public alias : string;
    public size : number;
    public sizeString : string;
    public sequences : number;
    public validID : string;
    public checked : boolean;
    public QCData : QCData;
    public constructor(path : string)
    {
        super();
        this.path = path;
        this.alias = trimPath(path);
        this.size = 0;
        this.sizeString = "0";
        this.sequences = 0;
        this.validID = makeValidID(path);
        this.checked = false;
        setUUID(this);
        this.QCData = new QCData();
    }
}