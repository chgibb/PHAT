import {getReadable,getReadableAndWritable} from "./req/getAppPath";
import {bootStrapCodeCache} from "./req/bootStrapCodeCache";

bootStrapCodeCache(
    getReadable("procMgrRenderer.js"),
    "./procMgrRenderer",
    getReadableAndWritable("procMgrRenderer.cdata")
);
