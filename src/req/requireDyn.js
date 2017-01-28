/**
 * @module req/requireDyn
*/
/** 
 * Dynamically require a module. Used to trick Browserify into not bundling a module passed to this method.
 * @function requireDyn
 * @param {string} target - the module to require 
 * @returns {any} - result of require(target)
*/
module.exports = function(target)
{
    return require(target);
}																																							
