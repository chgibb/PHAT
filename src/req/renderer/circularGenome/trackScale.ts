module.exports.add = function(options)
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
                            if(options && options.showlabels)
                                return `showlabels="${options.showlabels}"`;
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

module.exports.end = function()
{
    return `</trackscale>`;
}