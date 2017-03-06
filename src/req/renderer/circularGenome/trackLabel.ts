module.exports.add = function(options)
{
    let res = `
        <tracklabel ${
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

module.exports.end = function()
{
    return `</tracklabel>`;
}