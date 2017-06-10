import {getReadable,getReadableAndWritable} from "./req/getAppPath";
import {bootStrapCodeCache} from "./req/bootStrapCodeCache";

bootStrapCodeCache(
    getReadable("RenderCoverageTrackProcess.js"),
    "./RenderCoverageTrackProcess",
    getReadableAndWritable("RenderCoverageTrackProcess.cdata")
);
