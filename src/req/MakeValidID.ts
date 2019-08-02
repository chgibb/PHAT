/**
 * Replace old token with new token and return result
 *
 * @export
 * @param {string} str - Original string
 * @param {string} oldt - Old token
 * @param {string} newt - New token
 * @returns {string}
 */
export function replace(str : string,oldt : string,newt : string) : string
{
    let res = str;
    res = res.replace(new RegExp(oldt,"g"),newt);
    return res;
}

/**
 * Return valid HTML Id from given file path string
 *
 * @export
 * @param {string} str - File path string
 * @returns {string}
 */
export function makeValidID(str : string) : string
{
    let res = str;
    res = replace(res," ","_");
    res = replace(res,"[.]","_");
    res = replace(res,"/","a");
    res = replace(res,"\\\\","a");
    res = replace(res,":","a");
    res = replace(res,"[(]","_");
    res = replace(res,"[)]","_");
    return res;
}
