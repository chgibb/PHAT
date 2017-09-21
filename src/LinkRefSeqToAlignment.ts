import {getReadable,getReadableAndWritable} from "./req/getAppPath";
import {bootStrapCodeCache} from "./req/bootStrapCodeCache";

bootStrapCodeCache(
    getReadable("LinkRefSeqToAlignmentProcess.js"),
    "./LinkRefSeqToAlignmentProcess",
    getReadableAndWritable("LinkRefSeqToAlignmentProcess.cdata")
);
