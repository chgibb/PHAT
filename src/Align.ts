import {getReadable,getReadableAndWritable} from "./req/getAppPath";
import {bootStrapCodeCache} from "./req/bootStrapCodeCache";

bootStrapCodeCache(
    getReadable("AlignRenderer.js"),
    "./AlignRenderer",
    getReadableAndWritable("AlignRenderer.cdata")
);
