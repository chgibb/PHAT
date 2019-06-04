export default function tokenizeHTMLString(html : string) : Array<string>
{
    let res : Array<string> = new Array<string>();
    let add : boolean = true;
    let str : string = "";
    for(let i : number = 0; i != html.length; ++i)
    {
        add = true;
        if(html[i] == "<")
        {
            if(str != "")
                res.push(str);
            str = "";
        }
        if(html[i] == ">")
        {
            str += html[i];
            if(str != "")
                res.push(str);
            str = "";
            add = false;
        }
        if(add)
            str += html[i];
    }
    return res;
}