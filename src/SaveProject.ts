import {getReadable,getReadableAndWritable} from "./req/getAppPath";
import {bootStrapCodeCache} from "./req/bootStrapCodeCache";

bootStrapCodeCache(
    getReadable("SaveProjectProcess.js"),
    "./SaveProjectProcess",
    getReadableAndWritable("SaveProjectProcess.cdata")
);
