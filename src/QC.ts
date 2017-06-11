import {getReadable,getReadableAndWritable} from "./req/getAppPath";
import {bootStrapCodeCache} from "./req/bootStrapCodeCache";

bootStrapCodeCache(
    getReadable("QCRenderer.js"),
    "./QCRenderer",
    getReadableAndWritable("QCRenderer.cdata")
);
