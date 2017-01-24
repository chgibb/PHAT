/**
 * Dynamically require a module. Used to trick Browserify into not bundling a module passed to this method.
 * Exports a single method, returning the result of Node.require
 * @module req/requireDyn
*/
/** 
* @param target the module to require 
*/
module.exports = function(target)
{
    return require(target);
}																																							
