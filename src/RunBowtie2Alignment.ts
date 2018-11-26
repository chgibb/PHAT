import {getReadable,getReadableAndWritable} from "./req/getAppPath";
import {bootStrapCodeCache} from "./req/bootStrapCodeCache";

bootStrapCodeCache(
    getReadable("RunBowtie2AlignmentProcess.js"),
    "./RunBowtie2AlignmentProcess",
    getReadableAndWritable("RunBowtie2AlignmentProcess.cdata")
);
