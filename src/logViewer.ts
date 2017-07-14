import {getReadable,getReadableAndWritable} from "./req/getAppPath";
import {bootStrapCodeCache} from "./req/bootStrapCodeCache";

bootStrapCodeCache(
    getReadable("logViewerRenderer.js"),
    "./logViewerRenderer",
    getReadableAndWritable("logViewerRenderer.cdata")
);
