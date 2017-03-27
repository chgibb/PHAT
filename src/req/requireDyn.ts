/**
 * @module req/requireDyn
*/
/** 
 * Dynamically require a module. Used to trick Browserify into not bundling a module passed to this method.
 * @function requireDyn
 * @param {string} target - the module to require 
 * @returns {any} - result of require(target)
*/
export default function (target : string) : any
{
    return require(target);
}																																							
