console.time("mainStartup");

import {getReadable,getReadableAndWritable} from "./req/getAppPath";
import {bootStrapCodeCache} from "./req/bootStrapCodeCache";

bootStrapCodeCache(
    getReadable("mainProcess.js"),
    "./mainProcess",
    getReadableAndWritable("mainProcess.cdata")
);
console.timeEnd("mainStartup");