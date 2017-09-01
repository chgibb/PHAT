export interface PIDInfo
{
    pid : number;
    ppid : number;
    command : string;
    arguments : Array<string>;
    isPHAT : boolean;
    isPHATRenderer : boolean;
    isPHATMain : boolean;
    url : string;
}