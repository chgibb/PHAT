import {ProjectManifest} from "./projectManifest"
export interface ProjectIPC
{
    action : "newProject" | "openProject" | "saveCurrentProject";
    name : string;
    proj : ProjectManifest;
}