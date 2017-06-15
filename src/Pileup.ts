import {getReadable,getReadableAndWritable} from "./req/getAppPath";
import {bootStrapCodeCache} from "./req/bootStrapCodeCache";

bootStrapCodeCache(
    getReadable("PileupRenderer.js"),
    "./PileupRenderer",
    getReadableAndWritable("PileupRenderer.cdata")
);
