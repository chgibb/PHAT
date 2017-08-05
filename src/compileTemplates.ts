import {getReadable,getReadableAndWritable} from "./req/getAppPath";
import {bootStrapCodeCache} from "./req/bootStrapCodeCache";

bootStrapCodeCache(
    getReadable("compileTemplatesProcess.js"),
    "./compileTemplatesProcess",
    getReadableAndWritable("compileTemplatesProcess.cdata")
);
