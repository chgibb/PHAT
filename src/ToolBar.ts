import {getReadable,getReadableAndWritable} from "./req/getAppPath";
import {bootStrapCodeCache} from "./req/bootStrapCodeCache";

bootStrapCodeCache(
    getReadable("ToolBarRenderer.js"),
    "./ToolBarRenderer",
    getReadableAndWritable("ToolBarRenderer.cdata")
);
