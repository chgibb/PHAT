import {getReadable,getReadableAndWritable} from "./req/getAppPath";
import {bootStrapCodeCache} from "./req/bootStrapCodeCache";

bootStrapCodeCache(
    getReadable("OpenProjectProcess.js"),
    "./OpenProjectProcess",
    getReadableAndWritable("OpenProjectProcess.cdata")
);
