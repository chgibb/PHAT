import {ProjectManifest} from "./projectManifest"
interface ProjectIPC
{
    action : "newProject" | "openProject" | "saveCurrentProject";
    name : string;
    proj : ProjectManifest;
}