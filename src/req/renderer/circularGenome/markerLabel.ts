export function add
(
    options? : 
    {
        type : string,
        class : string,
        text : string,
        vAdjust : string,
        wAdjust : string
    }
) : string
{
    let res = `
        <markerlabel ${
            (
                ()=>
                {
                    if(options && options.type)
                        return `type="${options.type}"`;
                    return "";
                })()} ${
                    (
                        ()=>
                        {
                            if(options && options.class)
                                return `class="${options.class}"`;
                            return "";
                        })()} ${
                        (
                        ()=>
                        {
                            if(options && options.text)
                                return `text="${options.text}"`;
                            return "";
                        })()} ${
                        (
                        ()=>
                        {
                            if(options && options.vAdjust)
                                return `vadjust="${options.vAdjust}"`;
                            return "";
                        })()} ${
                        (
                        ()=>
                        {
                            if(options && options.wAdjust)
                                return `wadjust="${options.wAdjust}"`;
                            return "";
                        })()}>
            
    `;
    return res;
}

export function end()
{
    return `</markerlabel>`;
}