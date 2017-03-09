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