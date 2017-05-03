export function add(
    options? : {
        text? : string,
        labelStyle? : string,
        vAdjust? : string,
        wAdjust? : string,
        onClick? : string
    }
) : string
{
    let res = `
        <tracklabel ${(()=>{return options.onClick ? `ng-click="${options.onClick}()"` : "";})()} ${
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
                            if(options && options.labelStyle)
                                return `labelstyle="${options.labelStyle}"`;
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

export function end() : string
{
    return `</tracklabel>`;
}