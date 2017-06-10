/**
 * Standardizes passing of handlers to data models
 * @module res/renderer/model
 */
export abstract class DataModelMgr
{
    public channel : string;
    public ipcHandle : {send(channel : string, ...args : any[]) : void};
    /**
     * @param {string} channel - IPC channel to operate one
     * @param {any} handlers - object containing handler functions
     */
    constructor(channel : string,ipcHandle : {send(channel : string, ...args : any[]) : void})
    {
        /**
         * @prop {function(string,any)} postHandle - Function to pass IPC messages related to saving data through 
         * @prop {function(string,any)} spawnHandle - Function to pass IPC messages related to spawning processes through
         * @prop {function(string)} fsAccess - Function invoked on attempt to access the file system. Returns path to file.
         * @prop {string} channel - Channel to use in IPC messages
         */
        this.ipcHandle = ipcHandle;
        this.channel = channel;
    }

}