/**
 * @module req/renderer/faiParser
 */
/**
 * Naive implementation of a contig parser. Loads entire file into memory at once. Not suitable for large files.
 * @param {string} file - Path to file to load
 * @returns {Array<string>} - Array of contig names
 */
module.exports.getContigs = function(file)
{
    var res = new Array();
    var fs = require('fs');
    var tokens = fs.readFileSync(file).toString().split(new RegExp("[ ]|[\t]|[\n]"));
    for(var i = 0; i <= tokens.length; i += 5)
    {
        if(tokens[i])
            res.push(tokens[i]);
    }
    return res;
}