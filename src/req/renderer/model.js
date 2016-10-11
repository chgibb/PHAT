module.exports = class
{
    constructor(channel,handlers)
    {
        this.postHandle = handlers.postStateHandle;
        this.spawnHandle = handlers.spawnHandle;
        this.fsAccess = handlers.fsAccess;
        this.channel = channel;
    }
    spawnReply(channel,arg){}
}