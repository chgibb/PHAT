import * as fs from "fs";
const jsonFile = require("jsonfile");

let data : any = {};
let dataPath : string = "";

export function loadData(path : string) : boolean
{
    try
    {
        dataPath = path;
        data = jsonFile.readFileSync(path);
        return true;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}

export function saveData() : void
{
    try
    {
	    jsonFile.writeFileSync(dataPath,data,{spaces : 4});
    }
    catch(err)
    {
        console.log(err);
    }
}

export function getChannel(channel : string) : any | undefined
{
    try
    {
        return data[channel];
    }
    catch(err)
    {
        console.log(err);
        return undefined;
    }
}
export function createChannel(channel : string) : boolean
{
    try
    {
        data[channel] = {};
        return true;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}
export function getKey(channel : string,key : string) : any | undefined
{
    try
    {
        return data[channel][key];
    }
    catch(err)
    {
        console.log(err);
        return undefined;
    }
}
export function createKey(channel : string,key : string) : boolean
{
    try
    {
        if(!getChannel(channel))
        {
            createChannel(channel);
        }
        data[channel][key] = {};
        return true;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}
export function setKey(channel : string,key : string,val : any) : boolean
{
    try
    {
        if(!getChannel(channel))
            createChannel(channel);
        if(!getKey(channel,key))
            createKey(channel,key);
        data[channel][key] = val;
        return true;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}

export function stringifyData(
    replacer?: (key: string, value: any) => any,
    space?: string | number
) : string
{
    return JSON.stringify(data,replacer,space);
}