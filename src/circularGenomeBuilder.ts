import {getReadable,getReadableAndWritable} from "./req/getAppPath";
import {bootStrapCodeCache} from "./req/bootStrapCodeCache";

bootStrapCodeCache(
    getReadable("circularGenomeBuilderRenderer.js"),
    "./circularGenomeBuilderRenderer",
    getReadableAndWritable("circularGenomeBuilderRenderer.cdata")
);
