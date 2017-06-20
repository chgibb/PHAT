import {File} from "./file";
import {QCData} from "./QCData";
import {makeValidID} from "./MakeValidID";
export default class Fastq extends File
{
    public sizeString : string;
    public sequences : number;
    public validID : string;
    public checked : boolean;
    public QCData : QCData;
    public constructor(path : string)
    {
        super(path);
        this.sequences = 0;
        this.validID = makeValidID(path);
        this.checked = false;
        this.QCData = new QCData();
    }
}