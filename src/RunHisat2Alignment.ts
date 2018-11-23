import {getReadable,getReadableAndWritable} from "./req/getAppPath";
import {bootStrapCodeCache} from "./req/bootStrapCodeCache";

bootStrapCodeCache(
    getReadable("RunHisat2AlignmentProcess.js"),
    "./RunHisat2AlignmentProcess",
    getReadableAndWritable("RunHisat2AlignmentProcess.cdata")
);
