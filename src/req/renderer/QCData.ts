export class QCData
{
    public QCReport : string;
    public summary : Array<QCSummary>;
    public validID : string;
    public constructor()
    {
        this.QCReport = "";
        this.summary = new Array<QCSummary>();
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