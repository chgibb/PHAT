/**
 * Standardizes passing of handlers to data models
 * @module res/renderer/model
 */
module.exports = class
{
    /**
     * @param {string} channel - IPC channel to operate one
     * @param {any} handlers - object containing handler functions
     */
    constructor(channel,handlers)
    {
        /**
         * @prop {function(string,any)} postHandle - Function to pass IPC messages related to saving data through 
         * @prop {function(string,any)} spawnHandle - Function to pass IPC messages related to spawning processes through
         * @prop {function(string)} fsAccess - Function invoked on attempt to access the file system. Returns path to file.
         * @prop {string} channel - Channel to use in IPC messages
         */
        this.postHandle = handlers.postStateHandle;
        this.spawnHandle = handlers.spawnHandle;
        this.fsAccess = handlers.fsAccess;
        this.channel = channel;
    }
    /**
     * Method to handle replys from spawned processes
     * @param {string} channel
     * @param {any} arg
     * @return {void}
     */
    spawnReply(channel,arg){}
}