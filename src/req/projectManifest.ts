export interface ProjectManifest
{
    alias : string;
    tarBall : string;
    lastOpened : number;
    created : number;
    uuid : string;
}

let manifestFile = "projectManifests.json"
let manifestsPath : string = "";

export function setManifestsPath(path : string) : void
{
    manifestsPath = path;
}
export function getProjectManifests() : string
{
    if(manifestsPath)
        return manifestsPath+"/"+manifestFile;
    else
        throw new Error("manifests path not set");
}