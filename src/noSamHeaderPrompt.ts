import {getReadable,getReadableAndWritable} from "./req/getAppPath";
import {bootStrapCodeCache} from "./req/bootStrapCodeCache";

bootStrapCodeCache(
    getReadable("noSamHeaderPromptRenderer.js"),
    "./noSamHeaderPromptRenderer",
    getReadableAndWritable("noSamHeaderPromptRenderer.cdata")
);
