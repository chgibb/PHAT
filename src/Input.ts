import {getReadable,getReadableAndWritable} from "./req/getAppPath";
import {bootStrapCodeCache} from "./req/bootStrapCodeCache";

bootStrapCodeCache(
    getReadable("InputRenderer.js"),
    "./InputRenderer",
    getReadableAndWritable("InputRenderer.cdata")
);
