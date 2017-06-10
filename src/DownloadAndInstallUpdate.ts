import {getReadable,getReadableAndWritable} from "./req/getAppPath";
import {bootStrapCodeCache} from "./req/bootStrapCodeCache";

bootStrapCodeCache(
    getReadable("DownloadAndInstallUpdateProcess.js"),
    "./DownloadAndInstallUpdateProcess",
    getReadableAndWritable("DownloadAndInstallUpdateProcess.cdata")
);
