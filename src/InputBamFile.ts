import {getReadable,getReadableAndWritable} from "./req/getAppPath";
import {bootStrapCodeCache} from "./req/bootStrapCodeCache";

bootStrapCodeCache(
    getReadable("InputBamFileProcess.js"),
    "./InputBamFileProcess",
    getReadableAndWritable("InputBamFileProcess.cdata")
);
