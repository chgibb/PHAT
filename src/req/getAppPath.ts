import * as electron from "electron";
let app : Electron.App = null;

export function isRenderer() : boolean
{
    return (process && process.type == "renderer");
}

//electron.app is undefined in renderer
function getElectronApp()
{
    if(app)
        return;
    if(isRenderer())
    {
        app = electron.remote.app;
    }
    else
        app = electron.app;
}

export function getReadable(relativePath : string) : string
{
    return app.getAppPath()+relativePath;
}

export function getWritable(relativePath : string) : string
{
    return app.getPath("userData")+relativePath;
}

export function getReadableAndWritable(relativePath : string) : string
{
    return getWritable(relativePath);
}