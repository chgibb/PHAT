/**
 * @module req/renderer/formatByteString
 */
/**
 * Takes a number representing some number of bytes, returns a formatted string with the correct measurement
 * @function formatByteString
 * @param {number} bytes - Number of bytes 
 * @returns {string} - Formatted byte string
 */
//Adapted from https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable-string
export default function formatByteString(bytes : number) : string
{
    if(!bytes || bytes <= 0)
        return "0";
    let i = Math.floor( Math.log(bytes) / Math.log(1024) );
    let res = (bytes / parseInt(Math.pow(1024, i).toFixed(2)) * 1).toFixed(2);

    //if the result ends with ".00", trim it off
    if(res[res.length-1] == "0" && res[res.length-2] == "0" && res[res.length-3] == ".")
        res = res.substring(0,res.length-3);

    res +=  ["B", "kB", "MB", "GB", "TB"][i];

    return res;
}
