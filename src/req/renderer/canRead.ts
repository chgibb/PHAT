/**
 * @module req/renderer/canRead
 */
/// <reference types="node" />

import * as fs from "fs";
/**
 * @function canRead
 * @param {string} file - path to file to verify existence / permissions for
 * @returns {boolean} - Can / cannot read file
 */
export default function canRead(file : string) : boolean
{
    try
    {
        fs.accessSync(file,fs.constants.F_OK | fs.constants.R_OK);
    }
    catch(err)
    {
        return false;
    }
    return true;
}