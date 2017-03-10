export interface GetKeyEvent
{
    replyChannel : string;
    action : "getKey";
    channel : string;
    key : string;
}

export interface SaveKeyEvent
{
    action : "saveKey"
    channel : string;
    key : string;
    val : any;
}
export interface KeySubEvent
{
    action : "keySub";
    channel : string;
    key : string;
    replyChannel : string;
}
export interface KeyChangeEvent
{
    action : "keyChange";
    channel : string;
    key : any;
}