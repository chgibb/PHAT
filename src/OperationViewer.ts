import {getReadable,getReadableAndWritable} from "./req/getAppPath";
import {bootStrapCodeCache} from "./req/bootStrapCodeCache";

bootStrapCodeCache(
    getReadable("OperationViewerRenderer.js"),
    "./OperationViewerRenderer",
    getReadableAndWritable("OperationViewerRenderer.cdata")
);
