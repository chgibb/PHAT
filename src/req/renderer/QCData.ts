import {makeValidID} from "./MakeValidID";
export class QCData
{
    public QCReport : string;
    public checked : boolean;
    public name : string;
    public runningReport : boolean;
    public summary : Array<QCSummary>;
    public validID : string;
    public constructor(name : string)
    {
        this.QCReport = "";
        this.checked = false;
        this.name = name;
        this.runningReport = false;
        this.summary = new Array();
        this.validID = makeValidID(name);
    }
}
export class QCSummary
{
    public name : string;
    public status : string;
    public constructor(name : string,status : string)
    {
        if(name)
            this.name = name;
        else
            this.name = "";
        if(status)
            this.status = status;
        else
            this.status = "";
    }
}