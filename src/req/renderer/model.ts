/**
 * Standardizes passing of handlers to data models
 * @module res/renderer/model
 */
import {SpawnRequestParams} from "./../JobIPC";
export interface DataModelHandlers
{
    postStateHandle : (channel : string,arg : any) => void;
    spawnHandle : (channel : string,arg : SpawnRequestParams) => void;
    fsAccess : (path : string) => string;
}
export abstract class DataModelMgr
{
    public channel : string;
    public postHandle : (channel : string,arg : any) => void;
    public spawnHandle : (channel : string,arg : any) => void;
    public fsAccess : (path : string) => string;
    /**
     * @param {string} channel - IPC channel to operate one
     * @param {any} handlers - object containing handler functions
     */
    constructor(channel : string,handlers : DataModelHandlers)
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
    public abstract spawnReply(channel : string, arg : SpawnRequestParams) : void;
}