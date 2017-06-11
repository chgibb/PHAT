import {getReadable,getReadableAndWritable} from "./req/getAppPath";
import {bootStrapCodeCache} from "./req/bootStrapCodeCache";

bootStrapCodeCache(
    getReadable("RenderSNPTrackProcess.js"),
    "./RenderSNPTrackProcess",
    getReadableAndWritable("RenderSNPTrackProcess.cdata")
);
