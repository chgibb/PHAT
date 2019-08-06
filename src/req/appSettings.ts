import {getReadableAndWritable} from "./getAppPath";

const appSettingsPath = getReadableAndWritable("appSettings.json");

export class AppSettings
{
    public updateChannel : "stable" | "beta";
    constructor()
    {
        this.updateChannel = "stable";
    }
}

export function writeAppSettings(appSettings : AppSettings) : void
{
    const jsonFile = require("jsonfile");

    jsonFile.writeFileSync(appSettingsPath,appSettings);
}

export function getAppSettings() : AppSettings | undefined
{
    const jsonFile = require("jsonfile");
    
    try
    {
        return <AppSettings>jsonFile.readFileSync(appSettingsPath);
    }
    catch(err)
    {
        return new AppSettings();
    }
}