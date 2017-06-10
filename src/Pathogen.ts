import {getReadable,getReadableAndWritable} from "./req/getAppPath";
import {bootStrapCodeCache} from "./req/bootStrapCodeCache";

bootStrapCodeCache(
    getReadable("PathogenRenderer.js"),
    "./PathogenRenderer",
    getReadableAndWritable("PathogenRenderer.cdata")
);
