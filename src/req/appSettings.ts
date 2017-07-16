const jsonFile = require("jsonfile");

import {getReadableAndWritable} from "./getAppPath";

const appSettingsPath = getReadableAndWritable(`appSettings.json`);

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
    jsonFile.writeFileSync(appSettingsPath,appSettings);
}

export function getAppSettings() : AppSettings | undefined
{
    try
    {
        return <AppSettings>jsonFile.readFileSync(appSettingsPath);
    }
    catch(err)
    {
        return new AppSettings();
    }
}