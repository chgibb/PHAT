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
    let i = Math.floor( Math.log(bytes) / Math.log(1024) );
    return (bytes / parseFloat(Math.pow(1024, i).toFixed(2)) * 1 + ['B', 'kB', 'MB', 'GB', 'TB'][i]);
}
