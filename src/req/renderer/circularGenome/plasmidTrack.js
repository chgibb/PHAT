module.exports.add = function(options)
{
    let res = `
        <plasmidtrack ${
            (
                ()=>
                {
                    if(options && options.trackStyle)
                        return `trackstyle="${options.trackStyle}"`;
                    return "";
                })()} ${
                    (
                        ()=>
                        {
                            if(options && options.width)
                                return `width="${options.width}"`;
                            return "";
                        })()} ${
                        (
                        ()=>
                        {
                            if(options && options.radius)
                                return `radius="${options.radius}"`;
                            return "";
                        })()}>
            
    `;
    return res;
}

module.exports.end = function()
{
    return `</plasmidtrack>`;
}