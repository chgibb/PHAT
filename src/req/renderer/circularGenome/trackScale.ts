export function add(
    options : {
        interval : string,
        style : string,
        direction : string,
        tickSize : string,
        showLabels : string,
        vAdjust : string,
        labelStyle : string
    }
) : string
{
    let res = `
        <trackscale ${
            (
                ()=>
                {
                    if(options && options.interval)
                        return `interval="${options.interval}"`;
                    return "";
                })()} ${
                    (
                        ()=>
                        {
                            if(options && options.style)
                                return `style="${options.style}"`;
                            return "";
                        })()} ${
                        (
                        ()=>
                        {
                            if(options && options.direction)
                                return `direction="${options.direction}"`;
                            return "";
                        })()} ${
                        (
                        ()=>
                        {
                            if(options && options.tickSize)
                                return `ticksize="${options.tickSize}"`;
                            return "";
                        })()} ${
                        (
                        ()=>
                        {
                            if(options && options.showLabels)
                                return `showlabels="${options.showLabels}"`;
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
                            if(options && options.labelStyle)
                                return `labelstyle="${options.labelStyle}"`;
                            return "";
                        })()}>
            
    `;
    return res;
}

export function end() : string
{
    return `</trackscale>`;
}