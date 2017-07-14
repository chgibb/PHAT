import {getReadable,getReadableAndWritable} from "./req/getAppPath";
import {bootStrapCodeCache} from "./req/bootStrapCodeCache";

bootStrapCodeCache(
    getReadable("logViewer.js"),
    "./logViewer",
    getReadableAndWritable("logViewer.cdata")
);
