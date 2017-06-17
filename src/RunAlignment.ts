import {getReadable,getReadableAndWritable} from "./req/getAppPath";
import {bootStrapCodeCache} from "./req/bootStrapCodeCache";

bootStrapCodeCache(
    getReadable("RunAlignmentProcess.js"),
    "./RunAlignmentProcess",
    getReadableAndWritable("RunAlignmentProcess.cdata")
);
