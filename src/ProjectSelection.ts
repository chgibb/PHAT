import {getReadable,getReadableAndWritable} from "./req/getAppPath";
import {bootStrapCodeCache} from "./req/bootStrapCodeCache";

bootStrapCodeCache(
    getReadable("ProjectSelectionRenderer.js"),
    "./ProjectSelectionRenderer",
    getReadableAndWritable("ProjectSelectionRenderer.cdata")
);
