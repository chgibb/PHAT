export interface GetKeyEvent
{
    replyChannel : string;
    action : "getKey";
    channel : string;
    key : string;
}