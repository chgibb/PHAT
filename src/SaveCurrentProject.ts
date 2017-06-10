import {getReadable,getReadableAndWritable} from "./req/getAppPath";
import {bootStrapCodeCache} from "./req/bootStrapCodeCache";

bootStrapCodeCache(
    getReadable("SaveCurrentProjectProcess.js"),
    "./SaveCurrentProjectProcess",
    getReadableAndWritable("SaveCurrentProjectProcess.cdata")
);
