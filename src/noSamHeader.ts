import {getReadable,getReadableAndWritable} from "./req/getAppPath";
import {bootStrapCodeCache} from "./req/bootStrapCodeCache";

bootStrapCodeCache(
    getReadable("noSamHeaderRenderer.js"),
    "./noSamHeaderRenderer",
    getReadableAndWritable("noSamHeaderRenderer.cdata")
);
