import {getReadable,getReadableAndWritable} from "./req/getAppPath";
import {bootStrapCodeCache} from "./req/bootStrapCodeCache";

bootStrapCodeCache(
    getReadable("BLASTSegmentProcess.js"),
    "./BLASTSegmentProcess",
    getReadableAndWritable("BLASTSegmentProcess.cdata")
);
