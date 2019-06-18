export function replace(str : string,oldt : string,newt : string) : string
{
    let res = str;
    res = res.replace(new RegExp(oldt,"g"),newt);
    return res;
}

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
export function findOriginalInput(str : string,inputs : Array<any>) : string
{
    for(let i = 0; i != inputs.length; ++i)
    {
        if(makeValidID(inputs[i].name) === str)
            return inputs[i].name;
    }
    return "";
}
