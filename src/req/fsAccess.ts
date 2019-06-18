/**
 * @module req/fsAccess
 */
import * as url from "url";
import * as path from "path";
/**
 * Converts a local path to an absolute path.
 * @function fsAccess
 * @param {string} filePath - local path to convert
 * @param {boolean} addProtocol - add "file://" protocal to start of returned absolute path. (Defaults to true)
 * @returns {string} - absolute path to filePath
 */
export default function fsAccess(filePath : string,addProtocol : boolean = true) : string
{
    if(addProtocol)
    {
        return url.format(
            {
                protocol: "file",
                slashes: true,
                pathname: path.join(process.cwd(),filePath)
            }
        );
    }
    else
        return path.join(process.cwd(),filePath);
}