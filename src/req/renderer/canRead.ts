/**
 * @module req/renderer/canRead
 */

var fs = require('fs');
/**
 * @function canRead
 * @param {string} file - path to file to verify existence / permissions for
 * @returns {boolean} - Can / cannot read file
 */
module.exports = function(file)
{
    try
    {
        fs.accessSync(file,fs.F_OK | fs.R_OK);
    }
    catch(err)
    {
        return false;
    }
    return true;
}