export interface ProjectManifest
{
    alias : string;
    tarBall : string;
    lastOpened : string;
    created : string;
    uuid : string;
}

export let manifestsPath : string = "resources/app/projectsManifest.json";