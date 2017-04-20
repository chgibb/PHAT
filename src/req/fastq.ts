import {File} from "./file";
import {QCData,QCSummary} from "./QCData";
import {makeValidID} from "./MakeValidID";
import trimPath from "./trimPath";
export default class Fastq extends File
{
    public alias : string;
    public sizeString : string;
    public sequences : number;
    public validID : string;
    public checked : boolean;
    public QCData : QCData;
    public constructor(path : string)
    {
        super(path);
        this.alias = trimPath(path);
        this.sequences = 0;
        this.validID = makeValidID(path);
        this.checked = false;
        this.QCData = new QCData();
    }
}