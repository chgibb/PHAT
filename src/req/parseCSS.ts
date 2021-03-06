/**
 * Parse CSS string style, searching for targetProp, using delim as property delimiter
 * 
 * @export
 * @param {string} style  - Style string
 * @param {string} targetProp - Property to search for
 * @param {string} [delim=";"] - Property delimiter
 * @returns {string} 
 */
export function parseCSS(style : string,targetProp : string,delim = ";") : string
{
    if(!style)
        return "";
    let str = "";
    let res = "";
    let gettingValue = false;
    for(let i = 0; i != style.length; ++i)
    {
        if(!gettingValue)
        {
            if(style[i] == ":")
            {
                if(str == targetProp)
                {
                    gettingValue = true;
                    str = "";
                    continue;
                }
            }
            if(style[i] != " ")
            {
                str += style[i];
                continue;
            }
        }

        if(gettingValue)
        {
            if(style[i] != " " && style[i] != delim)
            {
                str += style[i];
                continue;
            }
            if(style[i] == delim)
            {
                return str;
            }

        }
    }
    if(gettingValue)
        return str;
    return "";
}