import {getReadable,getReadableAndWritable} from "./req/getAppPath";
import {bootStrapCodeCache} from "./req/bootStrapCodeCache";

bootStrapCodeCache(
    getReadable("outputRenderer.js"),
    "./outputRenderer",
    getReadableAndWritable("outputRenderer.cdata")
);
