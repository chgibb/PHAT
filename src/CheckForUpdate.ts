import {getReadable,getReadableAndWritable} from "./req/getAppPath";
import {bootStrapCodeCache} from "./req/bootStrapCodeCache";

bootStrapCodeCache(
    getReadable("CheckForUpdateProcess.js"),
    "./CheckForUpdateProcess",
    getReadableAndWritable("CheckForUpdateProcess.cdata")
);
