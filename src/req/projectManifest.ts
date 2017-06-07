export interface ProjectManifest
{
    alias : string;
    tarBall : string;
    lastOpened : number;
    created : number;
    uuid : string;
}

export let manifestsPath : string = "resources/app/projectsManifest.json";